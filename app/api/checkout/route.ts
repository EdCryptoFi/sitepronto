import { NextRequest, NextResponse } from 'next/server';
import { createPaymentPreference } from '@/lib/mercadopago';
import { insertBriefing } from '@/lib/supabase/client';
import { checkRateLimit, getIp } from '@/lib/rate-limit';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_SEGMENTS = ['restaurante', 'clinica', 'advocacia', 'loja', 'beleza', 'educacao', 'servicos', 'outro'];
const ALLOWED_GOALS = ['whatsapp', 'vender', 'agendar', 'portfolio'];
const ALLOWED_MATERIALS = ['complete', 'partial', 'none'];
const ALLOWED_PALETTES = ['azul-editorial', 'verde-servico', 'vinho-premium', 'minimal', 'vibrant', 'corporate', 'nature', 'tech', 'elegant'];
const ALLOWED_TEMPLATES = ['restaurant', 'farmacy', 'store', 'portfolio'];
const ALLOWED_MODULES = ['whatsapp', 'catalogo', 'agendamento', 'portfolio', 'blog', 'servicos', 'sobre', 'contato', 'galeria', 'depoimentos', 'faq'];
const ALLOWED_DOMAIN_CHOICES = ['new', 'later'];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function truncate(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, max);
}

export async function POST(request: NextRequest) {
  const { allowed, retryAfterMs } = checkRateLimit(`checkout:${getIp(request)}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde um momento.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
    });
  }

  try {
    const body = await request.json();

    // Fast-path: existing draft briefingId — just create MP preference
    if (body.briefingId && typeof body.briefingId === 'string' && UUID_RE.test(body.briefingId)) {
      const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supaUrl && supaKey) {
        const supabase = createClient(supaUrl, supaKey);
        const { data: existing } = await supabase
          .from('briefings')
          .select('id, domain, payment_status')
          .eq('id', body.briefingId)
          .single();

        if (existing && existing.payment_status === 'pending') {
          const paymentTitle = existing.domain ? `Site Pronto - ${existing.domain}.com.br` : 'Site Pronto';
          const paymentPreference = await createPaymentPreference({
            title: paymentTitle,
            price: 300,
            quantity: 1,
            payer_email: typeof body.payerEmail === 'string' ? body.payerEmail.slice(0, 254) : undefined,
            briefingId: existing.id,
          });
          return NextResponse.json({ success: true, briefing_id: existing.id, payment_preference: paymentPreference });
        }
      }
    }

    // Full create-path (legacy / fallback)
    if (!body.segment || !body.goal || !Array.isArray(body.selectedModules) || body.selectedModules.length === 0) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Validação de valores permitidos
    if (!ALLOWED_SEGMENTS.includes(body.segment)) {
      return NextResponse.json({ error: 'Segmento inválido' }, { status: 400 });
    }
    if (!ALLOWED_GOALS.includes(body.goal)) {
      return NextResponse.json({ error: 'Objetivo inválido' }, { status: 400 });
    }
    if (body.hasMaterials && !ALLOWED_MATERIALS.includes(body.hasMaterials)) {
      return NextResponse.json({ error: 'Materiais inválido' }, { status: 400 });
    }
    if (body.palette && !ALLOWED_PALETTES.includes(body.palette)) {
      return NextResponse.json({ error: 'Paleta inválida' }, { status: 400 });
    }
    if (body.template && !ALLOWED_TEMPLATES.includes(body.template)) {
      return NextResponse.json({ error: 'Template inválido' }, { status: 400 });
    }
    if (!ALLOWED_DOMAIN_CHOICES.includes(body.domainChoice)) {
      return NextResponse.json({ error: 'Escolha de domínio inválida' }, { status: 400 });
    }

    const modules: string[] = body.selectedModules.filter(
      (m: unknown) => typeof m === 'string' && ALLOWED_MODULES.includes(m)
    );
    if (modules.length === 0) {
      return NextResponse.json({ error: 'Módulos inválidos' }, { status: 400 });
    }

    // Sanitização de strings livres (trunca para evitar payloads gigantes)
    const briefingData = {
      segment: body.segment,
      goal: body.goal,
      has_materials: body.hasMaterials || null,
      logo_name: truncate(body.logoName, 200) || null,
      palette: body.palette || null,
      template: body.template || null,
      selected_modules: modules,
      whatsapp_number: truncate(body.whatsappNumber, 20) || null,
      business_hours: truncate(body.businessHours, 500) || null,
      catalog_products: Array.isArray(body.catalogProducts) ? body.catalogProducts.slice(0, 6) : [],
      domain_choice: body.domainChoice,
      domain: truncate(body.domain, 100) || null,
      content_notes: truncate(body.contentNotes, 2000) || '',
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const briefing = await insertBriefing(briefingData);

    const paymentTitle = body.domainChoice === 'new' && body.domain
      ? `Site Pronto - ${truncate(body.domain, 50)}.com.br`
      : 'Site Pronto';

    const paymentPreference = await createPaymentPreference({
      title: paymentTitle,
      price: 300,
      quantity: 1,
      payer_email: typeof body.payerEmail === 'string' ? truncate(body.payerEmail, 254) : undefined,
      briefingId: briefing.id,
    });

    return NextResponse.json({
      success: true,
      briefing_id: briefing.id,
      payment_preference: paymentPreference,
    });

  } catch (error) {
    console.error('Checkout error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Erro ao processar checkout' }, { status: 500 });
  }
}
