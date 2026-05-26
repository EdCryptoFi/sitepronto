import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getSitePrice(): Promise<number> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return 300;
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'site_price')
      .single();
    const parsed = parseInt(data?.value ?? '300', 10);
    return isNaN(parsed) || parsed < 1 ? 300 : parsed;
  } catch {
    return 300;
  }
}

async function getPixDiscount(): Promise<number> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return 75;
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'pix_discount')
      .single();
    const parsed = parseInt(data?.value ?? '75', 10);
    return isNaN(parsed) || parsed < 0 ? 75 : parsed;
  } catch {
    return 75;
  }
}

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(`pix:${getIp(req)}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }

  const briefingId = typeof body.briefingId === 'string' && UUID_RE.test(body.briefingId) ? body.briefingId : '';
  const payerEmail = typeof body.payerEmail === 'string' ? body.payerEmail.slice(0, 254) : '';
  const payerName = typeof body.payerName === 'string' ? body.payerName.slice(0, 120) : 'Cliente SitePronto';
  const payerCpf = typeof body.payerCpf === 'string' ? body.payerCpf.replace(/\D/g, '').slice(0, 11) : '';

  if (!briefingId) {
    return NextResponse.json({ error: 'briefingId obrigatório.' }, { status: 400 });
  }
  if (!payerEmail || !payerEmail.includes('@')) {
    return NextResponse.json({ error: 'E-mail obrigatório.' }, { status: 400 });
  }
  if (!payerCpf || payerCpf.length !== 11) {
    return NextResponse.json({ error: 'CPF obrigatório (11 dígitos).' }, { status: 400 });
  }

  // Verify briefing exists and is pending
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supaUrl || !supaKey) {
    return NextResponse.json({ error: 'Supabase não configurado.' }, { status: 500 });
  }

  const supabase = createClient(supaUrl, supaKey);
  const { data: briefing } = await supabase
    .from('briefings')
    .select('id, payment_status, domain')
    .eq('id', briefingId)
    .single();

  if (!briefing) {
    return NextResponse.json({ error: 'Briefing não encontrado.' }, { status: 404 });
  }
  if (briefing.payment_status === 'approved') {
    return NextResponse.json({ error: 'Pagamento já aprovado.' }, { status: 400 });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: 'MercadoPago não configurado.' }, { status: 500 });
  }

  const [sitePrice, pixDiscount] = await Promise.all([getSitePrice(), getPixDiscount()]);
  const pixPrice = Math.max(sitePrice - pixDiscount, 1);

  try {
    const mp = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(mp);

    const result = await payment.create({
      body: {
        transaction_amount: pixPrice,
        description: briefing.domain
          ? `Site Pronto - ${briefing.domain}.com.br`
          : 'Site Pronto - Site Profissional',
        payment_method_id: 'pix',
        payer: {
          email: payerEmail,
          first_name: payerName.split(' ')[0] || 'Cliente',
          last_name: payerName.split(' ').slice(1).join(' ') || 'SitePronto',
          identification: {
            type: 'CPF',
            number: payerCpf,
          },
        },
        external_reference: briefingId,
      },
    });

    // Extract Pix data
    const txData = result.point_of_interaction?.transaction_data;
    const qrCode = txData?.qr_code ?? '';
    const qrCodeBase64 = txData?.qr_code_base64 ?? '';
    const ticketUrl = txData?.ticket_url ?? '';
    const paymentId = result.id;

    if (!qrCode && !qrCodeBase64) {
      console.error('Pix creation missing QR data:', JSON.stringify(result, null, 2));
      return NextResponse.json({ error: 'Erro ao gerar QR code Pix.' }, { status: 500 });
    }

    // Store payment ID in briefing for status polling
    await supabase
      .from('briefings')
      .update({
        mp_payment_id: String(paymentId),
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefingId);

    return NextResponse.json({
      success: true,
      paymentId,
      pixPrice,
      originalPrice: sitePrice,
      discount: pixDiscount,
      qrCode,        // Pix copia-e-cola string
      qrCodeBase64,  // QR code image as base64
      ticketUrl,     // MercadoPago hosted payment page
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
    });
  } catch (error) {
    console.error('Pix payment error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Erro ao criar pagamento Pix.' }, { status: 500 });
  }
}
