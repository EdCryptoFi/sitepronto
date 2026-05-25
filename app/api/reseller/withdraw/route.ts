import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(`withdraw:${getIp(req)}`, 3, 60 * 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const { resellerId, pixKey, amount } = body;
  if (
    typeof resellerId !== 'string' ||
    typeof pixKey !== 'string' || pixKey.trim().length < 3 ||
    typeof amount !== 'number' || amount <= 0
  ) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Serviço indisponível' }, { status: 500 });

  const supabase = createClient(url, key);

  // Verify reseller exists and is active
  const { data: reseller } = await supabase
    .from('resellers')
    .select('id, commission_value, is_active')
    .eq('id', resellerId)
    .single();

  if (!reseller || !reseller.is_active) {
    return NextResponse.json({ error: 'Revendedor não encontrado' }, { status: 404 });
  }

  // Check for pending withdrawal (prevent double requests)
  const { data: pending } = await supabase
    .from('reseller_withdrawals')
    .select('id')
    .eq('reseller_id', resellerId)
    .eq('status', 'pending')
    .single();

  if (pending) {
    return NextResponse.json({ error: 'Você já tem uma solicitação pendente em análise.' }, { status: 409 });
  }

  const { error } = await supabase
    .from('reseller_withdrawals')
    .insert({
      reseller_id: resellerId,
      amount,
      pix_key: pixKey.trim(),
    });

  if (error) {
    console.error('withdraw insert error:', error.message);
    return NextResponse.json({ error: 'Erro ao registrar solicitação.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
