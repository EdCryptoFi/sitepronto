import { detectIndustry } from '@/lib/industry';
import { TONE_GUIDELINES, FEW_SHOT_EXAMPLES, COPY_FRAMEWORKS } from '@/lib/copy-framework';
import { detectIndustrySemantic, buildPromptContext, type DynamicIndustry } from '@/lib/context-engine';
import type { ImageSet } from '@/lib/image-bank';

export type AICopy = {
  hero_subheadline: string;
  cta_main: string;
  cta_sub: string;
  services: { name: string; description: string; icon: string }[];
  footer_tagline: string;
  faq?: { q: string; a: string }[];
  about_text?: string;
  image_prompts?: {
    hero: string;
    gallery: string[];
    catalog: string;
  };
  seo_keywords?: string[];
};

const OBJECTIVE_LABELS: Record<string, string> = {
  'vender-produtos': 'loja ou comércio que vende produtos',
  'servicos': 'prestação de serviços',
  'portfolio': 'portfólio profissional',
  'institucional': 'site institucional de empresa',
};

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  restaurant: 'fundo escuro com cores quentes, estilo gastronômico',
  farmacy: 'layout limpo e claro, cores suaves, seção de especialidades',
  store: 'grid de produtos minimalista, barra de filtros',
  portfolio: 'dark mode profissional, seção de skills, grid de projetos',
};

const MODULE_LABELS: Record<string, string> = {
  servicos: 'catálogo de serviços/produtos',
  sobre: 'história da empresa',
  contato: 'horários e WhatsApp',
  galeria: 'galeria de fotos',
  depoimentos: 'depoimentos de clientes',
  faq: 'perguntas frequentes',
};

export async function generateAICopy(input: {
  businessName: string;
  objective: string;
  description: string;
  template: string;
  modules: string[];
  palette?: string;
  paletteColors?: Record<string, string>;
}): Promise<AICopy | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  // Use context engine for semantic detection + richer context
  const detection = await detectIndustrySemantic(input.businessName, input.description);
  const industry = detection.industry;
  const objLabel = OBJECTIVE_LABELS[input.objective] ?? input.objective;
  const modulesLabel = input.modules.map(m => MODULE_LABELS[m] ?? m).join(', ') || 'padrão';
  const templateDesc = TEMPLATE_DESCRIPTIONS[input.template] ?? 'layout profissional responsivo';

  const hasDescription = (input.description ?? '').trim().length > 5;
  const hasName = (input.businessName ?? '').trim().length > 1;

  const contextEngineHint = buildPromptContext(industry);

  let contextHint: string;
  let extractionInstructions: string;

  if (hasDescription) {
    contextHint = `O cliente forneceu a seguinte descrição do negócio: "${input.description}"

${contextEngineHint}

⚠️ A descrição do cliente tem PRIORIDADE sobre as referências. Use-as para ENRIQUECER, não substituir.`;
    extractionInstructions = `A descrição do cliente é sua fonte PRINCIPAL e OBRIGATÓRIA para os services.
REGRAS:
- Extraia os 3 services EXATAMENTE da descrição do cliente (ex: "escapamento, pneus, alinhamento")
- Use as referências do segmento para COMPLEMENTAR a descrição de cada serviço (campo "description" de cada service)
- Se a descrição do cliente for curta (ex: só "escapamento, pneus"), você PODE usar as referências para dar mais profundidade
- NUNCA ignore os termos do cliente em favor das referências — a descrição dele tem PRIORIDADE
- NUNCA use: "Consultoria Estratégica", "Análise e Resultados", "Execução e Entrega"`;
  } else if (hasName) {
    contextHint = `O cliente informou apenas o nome "${input.businessName}".

${contextEngineHint}`;
    extractionInstructions = `Use as referências do segmento para gerar services REALISTAS e ESPECÍFICOS para ${industry.label}.
- Adapte os nomes e descrições para o negócio específico "${input.businessName}"
- NUNCA use serviços genéricos como "Consultoria Estratégica" ou "Análise de Resultados"
- Personalize as descrições como se fossem reais (horários, preços, bairros, etc.)`;
  } else {
    contextHint = `Nenhuma descrição foi fornecida.`;
    extractionInstructions = `Use o tipo de negócio (${objLabel}) para gerar textos PLÁUSIVEIS para o mercado brasileiro.
Evite termos vagos. Prefira serviços concretos e específicos.`;
  }

  // ── SEO GUIDELINES ─────────────────────────────────────────────────────
  const seoGuide = `
📈 DIRETRIZES DE SEO:
• hero_subheadline: inclua bairro/cidade se possível, e a principal especialidade
• services[].description: 1 frase com palavra-chave + benefício (máx 15 palavras)
• footer_tagline: única, memorável, com palavra-chave principal
• seo_keywords: 5-8 termos que clientes reais pesquisariam no Google
• image_prompts: descreva cenas REALISTAS que seriam fotografadas no negócio`;

  const fewShot = FEW_SHOT_EXAMPLES[input.template] ?? FEW_SHOT_EXAMPLES.portfolio;

  // ── FULL PROMPT ────────────────────────────────────────────────────────
  const prompt = `Você é copywriter especialista em sites para pequenas empresas brasileiras.
Você domina copywriting persuasivo e escreve como um profissional de agência premium.

**Negócio:** "${input.businessName || 'Meu Negócio'}"
**Tipo:** ${objLabel}
**Template:** ${input.template} — ${templateDesc}
**Seções:** ${modulesLabel}
${contextHint}
${seoGuide}

${extractionInstructions}

⚠️ REGRAS ABSOLUTAS (NÃO IGNORE):
1. Os 3 services DEVEM ser EXTRAÍDOS da descrição do cliente — NUNCA invente serviços genéricos
2. Se a descrição cita serviços específicos (ex: "troca de óleo, alinhamento, pneus"), USE-OS exatamente
3. NUNCA use: "Consultoria Estratégica", "Análise e Resultados", "Execução e Entrega" ou variações genéricas
4. hero_subheadline deve mencionar algo ESPECÍFICO do negócio (localização, especialidade, diferencial)
5. image_prompts.hero deve seguir a sugestão acima (📸 cena típica)
6. Emoji dos services deve combinar com o serviço (🔧 para mecânica, 🍕 para pizza, 💇 para cabeleireiro)
7. Cada service.description deve seguir: [benefício concreto] + [prova ou diferencial]. Ex: "Troca rápida com óleos de alta qualidade e filtros originais."

📋 EXEMPLO DE SAÍDA IDEAL (copie a ESTRUTURA, não o conteúdo):
${fewShot}

Responda APENAS com este JSON (sem markdown):
{
  "hero_subheadline": "específica ao negócio com cidade/bairro, até 15 palavras",
  "cta_main": "CTA persuasivo de até 4 palavras",
  "cta_sub": "incentivo ou benefício, até 10 palavras",
  "services": [
    {"name": "extraído da descrição", "description": "benefício + diferencial em 1 frase", "icon": "emoji relevante"},
    {"name": "extraído da descrição", "description": "benefício + diferencial em 1 frase", "icon": "emoji relevante"},
    {"name": "extraído da descrição", "description": "benefício + diferencial em 1 frase", "icon": "emoji relevante"}
  ],
  "footer_tagline": "memorável com palavra-chave, até 6 palavras",
  "image_prompts": {
    "hero": "cena realista do negócio (máx 10 palavras)",
    "gallery": ["cena 1", "cena 2", "cena 3"],
    "catalog": "descrição para fotos de produtos/serviços"
  },
  "faq": [
    {"q": "pergunta frequente 1", "a": "resposta direta e útil"},
    {"q": "pergunta frequente 2", "a": "resposta direta e útil"},
    {"q": "pergunta frequente 3", "a": "resposta direta e útil"}
  ],
  "about_text": "parágrafo sobre a história/diferencial do negócio (máx 30 palavras)",
  "seo_keywords": ["5-8 palavras-chave pesquisadas no Google"]
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.4,
            maxOutputTokens: 1000,
          },
        }),
        signal: AbortSignal.timeout(20000),
      }
    );

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (!parsed.hero_subheadline || !Array.isArray(parsed.services) || parsed.services.length < 3) {
      return null;
    }

    // Validate that services are not generic
    const genericTerms = ['consultoria', 'estratégica', 'estratégico', 'resultados', 'execução', 'entrega'];
    const hasGeneric = parsed.services.some((s: { name: string }) =>
      genericTerms.some(t => s.name.toLowerCase().includes(t))
    );
    if (hasGeneric && hasDescription) {
      return null; // Reject if client gave description but AI ignored it
    }

    return parsed as AICopy;
  } catch {
    return null;
  }
}

export function parseAICopyFromNotes(contentNotes: string | null): {
  businessName: string;
  description: string;
  ai: AICopy | null;
  logoPreview: string;
  dynamicIndustry: DynamicIndustry | null;
  images: ImageSet | null;
} {
  const empty = { businessName: '', description: '', ai: null, logoPreview: '', dynamicIndustry: null, images: null };
  if (!contentNotes) return empty;
  try {
    const parsed = JSON.parse(contentNotes);
    if (parsed && typeof parsed === 'object' && 'description' in parsed) {
      return {
        businessName: String(parsed.businessName ?? ''),
        description: String(parsed.description ?? ''),
        ai: parsed.ai ?? null,
        logoPreview: String(parsed.logoPreview ?? ''),
        dynamicIndustry: (parsed.dynamicIndustry as DynamicIndustry) ?? null,
        images: (parsed.images as ImageSet) ?? null,
      };
    }
  } catch {
    // not JSON — treat as plain description (legacy)
  }
  return { ...empty, description: contentNotes };
}
