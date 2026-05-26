import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '@/lib/rate-limit';
import { detectIndustry } from '@/lib/industry';
import { generateAICopy } from '@/lib/ai-copy';
import { generateDynamicIndustry } from '@/lib/context-engine';
import { fetchSegmentImages } from '@/lib/image-bank';

/**
 * SSE endpoint for site generation with real-time progress.
 * Replaces the monolithic save-draft for the frontend, streaming
 * step updates so the loading overlay can show real progress.
 *
 * POST body: same as save-draft
 * Response: text/event-stream with events:
 *   - { step: 'analyzing', progress: 10 }
 *   - { step: 'generating-copy', progress: 30 }
 *   - { step: 'fetching-images', progress: 60 }
 *   - { step: 'saving', progress: 85 }
 *   - { step: 'done', progress: 100, briefingId: '...' }
 *   - { step: 'error', message: '...' }
 */

const ALLOWED_OBJECTIVES = ['vender-produtos', 'servicos', 'portfolio', 'institucional'];
const ALLOWED_MODULES = [
  'galeria', 'faq', 'sobre', 'depoimentos', 'contato',
  'catalogo', 'agendamento', 'whatsapp', 'servicos', 'portfolio', 'blog',
];
const ALLOWED_PALETTES = [
  'azul-editorial', 'verde-servico', 'vinho-premium', 'minimal',
  'vibrant', 'corporate', 'nature', 'tech', 'elegant',
];
const ALLOWED_TEMPLATES = ['restaurant', 'farmacy', 'store', 'portfolio'];
const ALLOWED_DOMAIN_CHOICES = ['new', 'later'];

const OBJECTIVE_TO_SEGMENT: Record<string, string> = {
  'vender-produtos': 'loja', servicos: 'servicos',
  portfolio: 'educacao', institucional: 'outro',
};
const OBJECTIVE_TO_GOAL: Record<string, string> = {
  'vender-produtos': 'vender', servicos: 'servicos',
  portfolio: 'portfolio', institucional: 'institucional',
};
const PALETTE_COLORS: Record<string, { primary: string; accent: string }> = {
  'azul-editorial': { primary: '#004ac6', accent: '#2563eb' },
  'verde-servico':  { primary: '#0f766e', accent: '#14b8a6' },
  'vinho-premium':  { primary: '#7f1d1d', accent: '#be123c' },
  minimal:          { primary: '#374151', accent: '#6b7280' },
  vibrant:          { primary: '#004ac6', accent: '#eab308' },
  corporate:        { primary: '#002855', accent: '#004ac6' },
  nature:           { primary: '#059669', accent: '#f97316' },
  tech:             { primary: '#111827', accent: '#06b6d4' },
  elegant:          { primary: '#2b1b17', accent: '#b58e58' },
};

function truncate(val: unknown, max: number): string {
  return typeof val === 'string' ? val.slice(0, max) : '';
}

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(`gen:${getIp(req)}`, 5, 60_000);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Muitas tentativas. Aguarde.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Payload invalido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const b = body;
  if (!b.objective || !ALLOWED_OBJECTIVES.includes(String(b.objective))) {
    return new Response(JSON.stringify({ error: 'Objetivo invalido.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  if (!Array.isArray(b.selectedModules) || b.selectedModules.length === 0) {
    return new Response(JSON.stringify({ error: 'Modulos invalidos.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  if (!b.email || typeof b.email !== 'string' || !b.email.includes('@') || b.email.length > 254) {
    return new Response(JSON.stringify({ error: 'E-mail invalido.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const objective = String(b.objective);
  const modules: string[] = (b.selectedModules as unknown[]).filter(
    (m): m is string => typeof m === 'string' && ALLOWED_MODULES.includes(m)
  );
  const palette = typeof b.palette === 'string' && ALLOWED_PALETTES.includes(b.palette) ? b.palette : 'corporate';
  let template = typeof b.template === 'string' && ALLOWED_TEMPLATES.includes(b.template) ? b.template : 'portfolio';
  const domainChoice = typeof b.domainChoice === 'string' && ALLOWED_DOMAIN_CHOICES.includes(b.domainChoice) ? b.domainChoice : 'later';
  const portfolioItems = Array.isArray(b.portfolioItems)
    ? (b.portfolioItems as unknown[]).slice(0, 8).map((item) => {
        if (typeof item !== 'object' || item === null) return null;
        const i = item as Record<string, unknown>;
        return { id: truncate(i.id, 40), title: truncate(i.title, 120), category: truncate(i.category, 80), imagePreview: truncate(i.imagePreview, 500000) };
      }).filter(Boolean)
    : [];

  const businessName = truncate(b.businessName, 120);
  const description = truncate(b.description, 2000);
  const businessHours = truncate(b.businessHours, 500);
  const domain = truncate(b.domain, 100);
  const logoName = truncate(b.logoName, 200);
  const logoPreview = truncate(b.logoPreview, 600000);
  const whatsappNumber = truncate(b.whatsappNumber, 20);
  const emailAddr = typeof b.email === 'string' ? b.email.trim().slice(0, 254) : '';
  const referralCode = typeof b.referralCode === 'string' && /^[A-Z0-9_-]{3,30}$/.test(b.referralCode.toUpperCase())
    ? b.referralCode.toUpperCase()
    : null;

  // Stream response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Step 1: Analyze industry
        send({ step: 'analyzing', progress: 10, message: 'Analisando seu negocio...' });
        const industry = detectIndustry(businessName, description);
        if (!template || template === 'portfolio') {
          template = industry.template;
        }

        // Step 2: Generate AI copy
        send({ step: 'generating-copy', progress: 25, message: 'Gerando textos com IA...' });
        const aiCopy = await generateAICopy({
          businessName,
          objective,
          description,
          template,
          modules,
          palette,
          paletteColors: PALETTE_COLORS[palette],
        });

        // Step 3: Dynamic industry for unknown segments
        send({ step: 'researching', progress: 45, message: 'Pesquisando sobre seu segmento...' });
        const dynamicIndustry = industry.id === 'generico'
          ? await generateDynamicIndustry(businessName, description, 0)
          : null;

        // Step 4: Fetch images
        send({ step: 'fetching-images', progress: 60, message: 'Buscando imagens profissionais...' });
        const segmentForImages = dynamicIndustry ? 'generico' : industry.id;
        const images = await fetchSegmentImages(segmentForImages, businessName);

        // Step 5: Save to Supabase
        send({ step: 'saving', progress: 80, message: 'Montando layout responsivo...' });
        const contentNotes = JSON.stringify({ businessName, description, ai: aiCopy, logoPreview, dynamicIndustry, images });

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) {
          send({ step: 'error', message: 'Supabase nao configurado.' });
          controller.close();
          return;
        }

        const supabase = createClient(url, key);
        const detectedSegment = industry.id !== 'generico'
          ? industry.id
          : (OBJECTIVE_TO_SEGMENT[objective] ?? 'outro');

        const { data, error } = await supabase
          .from('briefings')
          .insert({
            segment: detectedSegment,
            goal: OBJECTIVE_TO_GOAL[objective],
            palette,
            template,
            selected_modules: modules,
            domain_choice: domainChoice,
            domain: domain || null,
            whatsapp_number: whatsappNumber || null,
            content_notes: contentNotes,
            business_hours: businessHours || null,
            logo_name: logoName || null,
            email: emailAddr || null,
            catalog_products: portfolioItems,
            payment_status: 'pending',
            referral_code: referralCode,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (error || !data) {
          send({ step: 'error', message: 'Erro ao salvar. Tente novamente.' });
          controller.close();
          return;
        }

        // Done!
        send({ step: 'done', progress: 100, message: 'Site pronto!', briefingId: data.id });
        controller.close();
      } catch (err) {
        console.error('Generate SSE error:', err instanceof Error ? err.message : String(err));
        send({ step: 'error', message: 'Erro inesperado. Tente novamente.' });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
