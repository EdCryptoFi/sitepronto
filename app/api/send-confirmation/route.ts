import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase/client';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // 3 emails por hora por IP
  const { allowed, retryAfterMs } = checkRateLimit(`send-email:${getIp(request)}`, 3, 60 * 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Limite de envio atingido.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
    });
  }

  try {
    const { briefingId, email } = await request.json();

    if (!briefingId || !UUID_RE.test(briefingId)) {
      return NextResponse.json({ error: 'briefingId inválido' }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
    }

    // Verifica se o briefing existe no banco antes de enviar
    if (supabase) {
      const { data: briefing } = await supabase
        .from('briefings')
        .select('id')
        .eq('id', briefingId)
        .single();

      if (!briefing) {
        return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
      }
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[send-confirmation] RESEND_API_KEY não configurado — e-mail não enviado');
      return NextResponse.json({ ok: true, simulated: true });
    }

    const resend = new Resend(apiKey);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sitepronto.com';
    const previewUrl = `${baseUrl}/preview/${briefingId}`;

    await resend.emails.send({
      from: 'SitePronto <confirmacao@sitepronto.com>',
      to: email,
      subject: 'Pagamento confirmado! Seu site está sendo preparado 🚀',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
            <div style="background:linear-gradient(135deg,#004ac6,#2563eb);padding:40px 32px;text-align:center;">
              <span style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">SitePronto<span style="color:#93c5fd">.</span></span>
              <h1 style="margin:16px 0 0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">Pagamento confirmado!</h1>
              <p style="margin:12px 0 0;font-size:16px;color:#bfdbfe;">Seu site está sendo preparado com cuidado.</p>
            </div>
            <div style="padding:40px 32px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:32px;text-align:center;">
                <span style="font-size:32px;">✅</span>
                <p style="margin:8px 0 0;font-size:15px;font-weight:600;color:#166534;">Recebemos seu pedido com sucesso!</p>
              </div>
              <h2 style="margin:0 0 12px;font-size:18px;font-weight:700;color:#0f172a;">O que acontece agora?</h2>
              <div>
                <div style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #f1f5f9;">
                  <div style="width:32px;height:32px;border-radius:50%;background:#dbe6ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#004ac6;font-size:14px;">1</div>
                  <div><p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">Análise do briefing</p><p style="margin:4px 0 0;font-size:14px;color:#64748b;">Revisamos as informações que você preencheu no quiz.</p></div>
                </div>
                <div style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #f1f5f9;">
                  <div style="width:32px;height:32px;border-radius:50%;background:#dbe6ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#004ac6;font-size:14px;">2</div>
                  <div><p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">Montagem do site</p><p style="margin:4px 0 0;font-size:14px;color:#64748b;">Construímos seu site com base no template e visual escolhidos.</p></div>
                </div>
                <div style="display:flex;gap:16px;padding:16px 0;">
                  <div style="width:32px;height:32px;border-radius:50%;background:#dbe6ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#004ac6;font-size:14px;">3</div>
                  <div><p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">Entrega em até 24 horas</p><p style="margin:4px 0 0;font-size:14px;color:#64748b;">Você recebe o link do site pronto para revisar e publicar.</p></div>
                </div>
              </div>
              <div style="margin-top:32px;text-align:center;">
                <a href="${previewUrl}" style="display:inline-block;background:linear-gradient(135deg,#004ac6,#2563eb);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600;">Ver prévia do meu site →</a>
              </div>
              <p style="margin:32px 0 0;font-size:13px;color:#94a3b8;text-align:center;">Dúvidas? Responda este e-mail ou acesse <a href="${baseUrl}" style="color:#2563eb;">${baseUrl}</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    console.error('[send-confirmation] erro ao enviar e-mail');
    return NextResponse.json({ error: 'Erro ao enviar e-mail' }, { status: 500 });
  }
}
