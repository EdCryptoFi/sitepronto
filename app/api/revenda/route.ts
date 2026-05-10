import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(`revenda:${getIp(req)}`, 3, 60 * 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente em 1 hora.' }, { status: 429 });
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

  const { name, email, whatsapp } = body as Record<string, unknown>;

  if (
    typeof name !== 'string' || name.trim().length < 2 || name.length > 120 ||
    typeof email !== 'string' || !email.includes('@') || email.length > 254 ||
    typeof whatsapp !== 'string' || whatsapp.trim().length < 8 || whatsapp.length > 20
  ) {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Serviço indisponível.' }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from('resellers').insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    whatsapp: whatsapp.trim(),
  });

  if (error) {
    console.error('Revenda insert error:', error.message);
    return NextResponse.json({ error: 'Erro ao salvar cadastro.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
