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
    const downloadUrl = `${baseUrl}/api/download-site/${briefingId}`;

    await resend.emails.send({
      from: 'SitePronto <noreply@siteprontobr.xyz>',
      to: email,
      subject: '✅ Site pronto para download — SitePronto',
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.07)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#004ac6 0%,#2563eb 100%);padding:40px 32px;text-align:center">
      <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.5px">SitePronto<span style="color:#93c5fd">.</span></div>
      <div style="margin-top:20px;width:64px;height:64px;background:rgba(255,255,255,.15);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px">🎉</div>
      <h1 style="margin:16px 0 0;font-size:26px;font-weight:800;color:#fff;line-height:1.2">Seu site está pronto!</h1>
      <p style="margin:10px 0 0;font-size:15px;color:#bfdbfe">Pagamento confirmado · Download disponível agora</p>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px">

      <!-- Download CTA — principal -->
      <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:16px;padding:28px;text-align:center;margin-bottom:32px">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:.08em">Seu site está pronto para baixar</p>
        <p style="margin:0 0 20px;font-size:14px;color:#15803d">Clique no botão abaixo para baixar o arquivo ZIP com o seu site completo.</p>
        <a href="${downloadUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:16px 36px;border-radius:12px;font-size:16px;font-weight:700;letter-spacing:-.01em">⬇️ Baixar meu site (.zip)</a>
        <p style="margin:16px 0 0;font-size:12px;color:#6b7280">O arquivo contém <strong>index.html</strong> + instruções de publicação</p>
      </div>

      <!-- Preview -->
      <div style="margin-bottom:28px;text-align:center">
        <a href="${previewUrl}" style="display:inline-block;border:2px solid #e2e8f0;color:#334155;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600">👁️ Ver prévia do site no navegador</a>
      </div>

      <!-- Como publicar -->
      <div style="border-top:1px solid #f1f5f9;padding-top:28px">
        <h2 style="margin:0 0 16px;font-size:17px;font-weight:700;color:#0f172a">Como publicar seu site</h2>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;gap:14px;align-items:flex-start">
            <div style="min-width:28px;height:28px;border-radius:50%;background:#dbe6ff;color:#004ac6;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center">1</div>
            <div>
              <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a">Baixe e descompacte o arquivo ZIP</p>
              <p style="margin:4px 0 0;font-size:13px;color:#64748b">Você vai encontrar o arquivo <code style="background:#f1f5f9;padding:1px 5px;border-radius:4px">index.html</code> dentro da pasta.</p>
            </div>
          </div>
          <div style="display:flex;gap:14px;align-items:flex-start">
            <div style="min-width:28px;height:28px;border-radius:50%;background:#dbe6ff;color:#004ac6;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center">2</div>
            <div>
              <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a">Acesse a hospedagem ou registrador do domínio</p>
              <p style="margin:4px 0 0;font-size:13px;color:#64748b">Entre no painel da sua hospedagem (cPanel, Hostinger, Locaweb, etc.) e acesse o Gerenciador de Arquivos.</p>
            </div>
          </div>
          <div style="display:flex;gap:14px;align-items:flex-start">
            <div style="min-width:28px;height:28px;border-radius:50%;background:#dbe6ff;color:#004ac6;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center">3</div>
            <div>
              <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a">Envie o <code style="background:#f1f5f9;padding:1px 5px;border-radius:4px">index.html</code> para a pasta <code style="background:#f1f5f9;padding:1px 5px;border-radius:4px">public_html</code></p>
              <p style="margin:4px 0 0;font-size:13px;color:#64748b">Faça upload do arquivo e acesse seu domínio — o site estará no ar!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Suporte -->
      <div style="margin-top:28px;background:#f8fafc;border-radius:12px;padding:20px;text-align:center">
        <p style="margin:0;font-size:14px;color:#475569">Precisa de ajuda para publicar? <strong>Respondemos este e-mail</strong> ou fale pelo WhatsApp.</p>
        <a href="https://wa.me/5511999999999?text=Olá!%20Preciso%20de%20ajuda%20para%20publicar%20meu%20site.%20Pedido%3A%20${briefingId.slice(0,8).toUpperCase()}" style="display:inline-block;margin-top:12px;background:#16a34a;color:#fff;text-decoration:none;padding:10px 24px;border-radius:10px;font-size:13px;font-weight:600">💬 Falar no WhatsApp</a>
      </div>

      <p style="margin:28px 0 0;font-size:12px;color:#94a3b8;text-align:center">
        Pedido #${briefingId.slice(0,8).toUpperCase()} · <a href="${baseUrl}" style="color:#2563eb;text-decoration:none">sitepronto.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    console.error('[send-confirmation] erro ao enviar e-mail');
    return NextResponse.json({ error: 'Erro ao enviar e-mail' }, { status: 500 });
  }
}
