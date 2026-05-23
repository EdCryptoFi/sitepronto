import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '@/lib/rate-limit';
import { generateAICopy } from '@/lib/ai-copy';
import { detectIndustry } from '@/lib/industry';
import { generateDynamicIndustry } from '@/lib/context-engine';
import { fetchSegmentImages } from '@/lib/image-bank';

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

const ALLOWED_OBJECTIVES = ['vender-produtos', 'servicos', 'portfolio', 'institucional'];
const ALLOWED_PALETTES = ['azul-editorial', 'verde-servico', 'vinho-premium', 'minimal', 'vibrant', 'corporate', 'nature', 'tech', 'elegant'];
const ALLOWED_TEMPLATES = ['restaurant', 'farmacy', 'store', 'portfolio'];
const ALLOWED_MODULES = ['servicos', 'sobre', 'contato', 'galeria', 'depoimentos', 'faq'];
const ALLOWED_DOMAIN_CHOICES = ['new', 'later'];

const OBJECTIVE_TO_SEGMENT: Record<string, string> = {
  'vender-produtos': 'loja',
  'servicos': 'servicos',
  'portfolio': 'educacao',
  'institucional': 'outro',
};

const OBJECTIVE_TO_GOAL: Record<string, string> = {
  'vender-produtos': 'vender',
  'servicos': 'whatsapp',
  'portfolio': 'portfolio',
  'institucional': 'whatsapp',
};

function truncate(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, max);
}

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(`save-draft:${getIp(req)}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  if (!b.objective || !ALLOWED_OBJECTIVES.includes(String(b.objective))) {
    return NextResponse.json({ error: 'Objetivo inválido.' }, { status: 400 });
  }
  if (!Array.isArray(b.selectedModules) || b.selectedModules.length === 0) {
    return NextResponse.json({ error: 'Módulos inválidos.' }, { status: 400 });
  }
  if (!b.email || typeof b.email !== 'string' || !b.email.includes('@') || b.email.length > 254) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
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
  const logoPreview = truncate(b.logoPreview, 600000); // base64 — max ~450 KB
  const whatsappNumber = truncate(b.whatsappNumber, 20);

  // Detect industry from business name + description (primary source of truth for segment)
  const industry = detectIndustry(businessName, description);
  // Override template only if user didn't pick one explicitly (or picked the default)
  if (!template || template === 'portfolio') {
    template = industry.template;
  }

  // Generate AI copy (non-blocking fallback if Gemini fails)
  const aiCopy = await generateAICopy({
    businessName,
    objective,
    description,
    template,
    modules,
    palette,
    paletteColors: PALETTE_COLORS[palette],
  });

  // For unknown segments, research the industry with Gemini so the site generator has rich context
  const dynamicIndustry = industry.id === 'generico'
    ? await generateDynamicIndustry(businessName, description)
    : null;

  // Fetch real photos from Unsplash for this segment (non-blocking — falls back to SVGs if no API key)
  const segmentForImages = dynamicIndustry ? 'generico' : industry.id;
  const images = await fetchSegmentImages(segmentForImages, businessName);

  const contentNotes = JSON.stringify({ businessName, description, ai: aiCopy, logoPreview, dynamicIndustry, images });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase não configurado.' }, { status: 500 });
  }

  const supabase = createClient(url, key);
  // Segment: prefer industry detected from name/description; fall back to objective mapping
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
      catalog_products: portfolioItems,
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('save-draft error:', error?.message);
    return NextResponse.json({ error: 'Erro ao salvar briefing.' }, { status: 500 });
  }

  return NextResponse.json({ briefingId: data.id });
}
