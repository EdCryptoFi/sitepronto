import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

const ALLOWED_PALETTES = ['azul-editorial', 'verde-servico', 'vinho-premium', 'minimal', 'vibrant', 'corporate', 'nature', 'tech', 'elegant'];
const ALLOWED_TEMPLATES = ['restaurant', 'farmacy', 'store', 'portfolio'];

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(`regen:${getIp(req)}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }

  const briefingId = typeof body.briefingId === 'string' ? body.briefingId : '';
  if (!briefingId) {
    return NextResponse.json({ error: 'briefingId obrigatório.' }, { status: 400 });
  }

  const palette = typeof body.palette === 'string' && ALLOWED_PALETTES.includes(body.palette) ? body.palette : undefined;
  const template = typeof body.template === 'string' && ALLOWED_TEMPLATES.includes(body.template) ? body.template : undefined;

  if (!palette && !template) {
    return NextResponse.json({ error: 'Nenhuma alteração solicitada.' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase não configurado.' }, { status: 500 });
  }

  const supabase = createClient(url, key);

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (palette) update.palette = palette;
  if (template) update.template = template;

  const { error } = await supabase
    .from('briefings')
    .update(update)
    .eq('id', briefingId);

  if (error) {
    console.error('regenerate-preview error:', error.message);
    return NextResponse.json({ error: 'Erro ao atualizar.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
