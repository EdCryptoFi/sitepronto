// ─── CONTEXT ENGINE ───────────────────────────────────────────────────────────
// Camada inteligente que conecta a descrição do negócio ao contexto mais
// relevante da indústria usando embeddings semânticos + Supabase.
//
// Fluxo:
//   1. getEmbedding(text) → vector(768) via Gemini API
//   2. match_contexts RPC → indústria mais similar no banco
//   3. buildPromptContext(industry) → contexto rico pro prompt da IA
//   4. Fallback: detectIndustry() por keywords quando sem embedding/DB

import { supabase } from '@/lib/supabase/client';
import {
  detectIndustry,
  getIndustryById,
  validateAIContent,
  type IndustryInfo,
} from '@/lib/industry';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type ServiceItem = {
  icon: string;
  name: string;
  description: string;
};

export type ToneGuidelines = {
  voice: string;
  vocabulary: string[];
  avoid: string[];
  ctaStyle: string;
  socialProof: string;
};

export type FewShotExample = {
  headline: string;
  services: ServiceItem[];
  cta_main: string;
  cta_sub: string;
  tagline: string;
};

export type SiteContext = IndustryInfo & {
  tone_guidelines: ToneGuidelines | null;
  few_shot_examples: FewShotExample[] | null;
};

export type DetectionResult = {
  industry: SiteContext;
  method: 'embedding' | 'keyword' | 'default';
  score: number;
};

// ─── EMBEDDING VIA GEMINI ────────────────────────────────────────────────────

const EMBEDDING_MODEL = 'models/embedding-001';
const EMBEDDING_DIMENSIONS = 768;

export async function getEmbedding(text: string): Promise<number[] | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          content: { parts: [{ text: text.slice(0, 2000) }] },
        }),
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json?.embedding?.values as number[] | null;
  } catch {
    return null;
  }
}

// ─── SEMANTIC DETECTION ──────────────────────────────────────────────────────

export async function detectIndustrySemantic(
  businessName: string,
  description: string
): Promise<DetectionResult> {
  const text = `${businessName} ${description}`.trim();

  // 1. Try embedding match via Supabase
  if (supabase) {
    try {
      const embedding = await getEmbedding(text);
      if (embedding) {
        const { data } = await supabase.rpc('match_contexts', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: 1,
        });

        if (data && data.length > 0) {
          const match = data[0];
          const base: IndustryInfo = {
            id: match.id,
            label: match.label,
            keywords: match.keywords ?? [],
            template: match.template,
            fallbackServices: match.fallback_services ?? [],
            fallbackHeadline: match.fallback_headline ?? '',
            fallbackCTA: match.fallback_cta ?? '',
            fallbackCTASub: match.fallback_cta_sub ?? '',
            fallbackTagline: match.fallback_tagline ?? '',
            imagePrompt: match.image_prompt ?? '',
            galleryPrompts: match.gallery_prompts ?? [],
          };
          return {
            industry: {
              ...base,
              tone_guidelines: match.tone_guidelines as ToneGuidelines | null,
              few_shot_examples: match.few_shot_examples as FewShotExample[] | null,
            },
            method: 'embedding',
            score: match.similarity ?? 0,
          };
        }
      }
    } catch {
      // fall through to keyword detection
    }
  }

  // 2. Fallback: keyword detection
  const industry = detectIndustry(businessName, description);
  const base = getIndustryById(industry.id) ?? industry;
  return {
    industry: {
      ...base,
      tone_guidelines: null,
      few_shot_examples: null,
    },
    method: 'keyword',
    score: 50, // arbitrary
  };
}

// ─── CONTEXT PACK FOR AI PROMPT ──────────────────────────────────────────────

export function buildPromptContext(ctx: SiteContext): string {
  const parts: string[] = [];

  parts.push(`📌 SEGMENTO: ${ctx.label}`);
  parts.push(`🎨 TEMPLATE RECOMENDADO: ${ctx.template}`);
  parts.push('');

  // Few-shot examples
  if (ctx.few_shot_examples && ctx.few_shot_examples.length > 0) {
    parts.push('📋 EXEMPLOS DE CONTEÚDO QUE FUNCIONA PARA ESTE SEGMENTO:');
    for (const ex of ctx.few_shot_examples.slice(0, 2)) {
      parts.push(`  Headline: "${ex.headline}"`);
      if (ex.services) {
        for (const s of ex.services) {
          parts.push(`  • ${s.icon} ${s.name}: ${s.description}`);
        }
      }
      parts.push(`  CTA: "${ex.cta_main}" — "${ex.cta_sub}"`);
      parts.push(`  Slogan: "${ex.tagline}"`);
      parts.push('');
    }
  } else {
    // Fallback to static references
    parts.push('📋 REFERÊNCIAS DO SEGMENTO:');
    for (const s of ctx.fallbackServices) {
      parts.push(`  • ${s.icon} ${s.name}: ${s.description}`);
    }
    parts.push(`  Headline: "${ctx.fallbackHeadline}"`);
    parts.push(`  CTA: "${ctx.fallbackCTA}" — "${ctx.fallbackCTASub}"`);
    parts.push(`  Slogan: "${ctx.fallbackTagline}"`);
    parts.push('');
  }

  // Tone guidelines
  if (ctx.tone_guidelines) {
    const t = ctx.tone_guidelines;
    parts.push('🎯 TOM DE VOZ:');
    parts.push(`  • Voz: ${t.voice}`);
    parts.push(`  • Vocabulário: ${t.vocabulary.join(', ')}`);
    parts.push(`  • Evite: ${t.avoid.join(', ')}`);
    parts.push(`  • CTA style: ${t.ctaStyle}`);
    parts.push(`  • Prova social: ${t.socialProof}`);
    parts.push('');
  }

  // Image hints
  parts.push(`📸 SUGESTÃO DE IMAGEM PRINCIPAL: ${ctx.imagePrompt}`);
  if (ctx.galleryPrompts.length > 0) {
    parts.push('📸 SUGESTÕES DE IMAGEM PARA GALERIA:');
    for (let i = 0; i < ctx.galleryPrompts.length; i++) {
      parts.push(`  ${i + 1}. ${ctx.galleryPrompts[i]}`);
    }
  }

  // SEO keywords
  const seoKeywords = [
    ctx.label,
    ctx.label.toLowerCase(),
    ...ctx.fallbackServices.map(s => s.name.toLowerCase()),
  ];
  parts.push(`🔑 SEO keywords: ${seoKeywords.join(', ')}`);

  return parts.join('\n');
}

// ─── FEEDBACK LOOP ────────────────────────────────────────────────────────────

export async function recordSuccessfulGeneration(
  industryId: string,
  briefingId: string | undefined,
  data: {
    services: ServiceItem[];
    headline?: string;
    cta_main?: string;
    cta_sub?: string;
    tagline?: string;
  },
  accepted: boolean
): Promise<void> {
  if (!supabase) return;

  try {
    // Record feedback
    await supabase.from('generation_feedback').insert({
      industry_id: industryId,
      briefing_id: briefingId,
      services: JSON.stringify(data.services),
      headline: data.headline,
      cta: data.cta_main,
      accepted,
    });

    // If accepted, update few-shot examples in the context
    if (accepted && data.services.length >= 3) {
      const { data: ctx } = await supabase
        .from('site_contexts')
        .select('few_shot_examples')
        .eq('id', industryId)
        .single();

      const examples: FewShotExample[] = (ctx?.few_shot_examples as FewShotExample[]) ?? [];
      examples.unshift({
        headline: data.headline ?? '',
        services: data.services,
        cta_main: data.cta_main ?? '',
        cta_sub: data.cta_sub ?? '',
        tagline: data.tagline ?? '',
      });

      // Keep max 5 most recent
      await supabase
        .from('site_contexts')
        .update({ few_shot_examples: JSON.stringify(examples.slice(0, 5)) })
        .eq('id', industryId);
    }
  } catch {
    // silent — feedback is non-critical
  }
}
