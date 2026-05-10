import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { updatePaymentStatus } from '@/lib/supabase/client';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TIMESTAMP_TTL_S = 300; // rejeita webhooks com mais de 5 min

function validateSignature(dataId: string, requestId: string, signature: string, secret: string): boolean {
  const ts = signature.split(',').find(p => p.startsWith('ts='))?.slice(3);
  const v1 = signature.split(',').find(p => p.startsWith('v1='))?.slice(3);
  if (!ts || !v1) return false;

  // Anti-replay: rejeita se timestamp for antigo ou futuro
  const tsNum = Number(ts);
  if (isNaN(tsNum) || Math.abs(Date.now() / 1000 - tsNum) > TIMESTAMP_TTL_S) return false;

  const template = `id:${dataId};request-id:${requestId};ts:${ts}`;
  const hmac = createHmac('sha256', secret).update(template).digest('hex');
  return hmac === v1;
}

export async function POST(request: NextRequest) {
  // 120 requisições por minuto por IP (MP pode enviar em burst)
  const { allowed } = checkRateLimit(`webhook:${getIp(request)}`, 120, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  }

  try {
    const secret = process.env.MP_WEBHOOK_SECRET;

    if (!secret) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[webhook] MP_WEBHOOK_SECRET não configurado em produção');
        return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 });
      }
      // desenvolvimento: processa sem validação mas registra aviso
      console.warn('[webhook] MP_WEBHOOK_SECRET não configurado — modo dev, sem validação de assinatura');
    }

    const body = await request.json();

    if (secret) {
      const signature = request.headers.get('x-signature') ?? '';
      const requestId = request.headers.get('x-request-id') ?? '';
      const dataId = String(body.data?.id ?? '');

      if (!validateSignature(dataId, requestId, signature, secret)) {
        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
      }
    }

    if (body.type !== 'payment' && body.type !== 'subscription') {
      return NextResponse.json({ message: 'Notificação ignorada' }, { status: 200 });
    }

    return await processPayment(body);

  } catch (error) {
    console.error('[webhook] erro ao processar');
    return NextResponse.json({ error: 'Erro ao processar webhook' }, { status: 500 });
  }
}

async function processPayment(body: { data?: { id?: unknown } }) {
  const paymentId = body.data?.id;
  if (!paymentId) {
    return NextResponse.json({ message: 'Sem payment_id' }, { status: 200 });
  }

  let briefingId: string | undefined;
  let status: 'pending' | 'approved' | 'rejected' = 'pending';
  let payerEmail: string | undefined;

  if (process.env.MP_ACCESS_TOKEN) {
    try {
      const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
      const payment = await new Payment(mpClient).get({ id: String(paymentId) });

      const mpStatus = payment.status;
      if (mpStatus === 'approved') status = 'approved';
      else if (mpStatus === 'rejected' || mpStatus === 'cancelled') status = 'rejected';

      briefingId = payment.external_reference ?? undefined;
      payerEmail = payment.payer?.email ?? undefined;
    } catch {
      console.error('[webhook] erro ao buscar payment do MP');
    }
  }

  if (briefingId && UUID_RE.test(briefingId)) {
    await updatePaymentStatus(briefingId, status);

    if (status === 'approved' && payerEmail) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sitepronto.com';
        await fetch(`${baseUrl}/api/send-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ briefingId, email: payerEmail }),
        });
      } catch {
        console.error('[webhook] erro ao enviar e-mail de confirmação');
      }
    }
  }

  return NextResponse.json({
    message: 'Webhook processado com sucesso',
    payment_id: paymentId,
    status,
  }, { status: 200 });
}
