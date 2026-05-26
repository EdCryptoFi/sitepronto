import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

/**
 * Cron endpoint: sends reminder emails for abandoned briefings.
 * Triggered by Vercel Cron (vercel.json) or external scheduler.
 *
 * Logic:
 * - Finds briefings with payment_status='pending', created 1-48h ago, with email, no reminder sent yet.
 * - Sends a single reminder email per briefing.
 * - Marks reminder_sent_at so we don't re-send.
 *
 * Security: protected by CRON_SECRET header.
 */

const SEGMENT_LABELS: Record<string, string> = {
  restaurante: 'Restaurante', loja: 'Loja', clinica: 'Clínica',
  beleza: 'Salão / Estética', mecanica: 'Oficina Mecânica',
  advocacia: 'Escritório de Advocacia', educacao: 'Educação',
  construcao: 'Construção', farmacia: 'Farmácia',
  veterinaria: 'Clínica Veterinária', petshop: 'Pet Shop',
  academia: 'Academia', imobiliaria: 'Imobiliária',
  contabilidade: 'Contabilidade', tecnologia: 'Tecnologia',
  turismo: 'Turismo', transporte: 'Transporte',
  fotografia: 'Fotografia', generico: 'Negócio', outro: 'Negócio',
};

export async function GET(req: NextRequest) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supaUrl || !supaKey || !resendKey) {
    return NextResponse.json({ error: 'Missing config' }, { status: 500 });
  }

  const supabase = createClient(supaUrl, supaKey);
  const resend = new Resend(resendKey);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sitepronto.com';

  // Find abandoned carts: pending payment, created 1h-48h ago, has email, no reminder sent
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: briefings, error: fetchError } = await supabase
    .from('briefings')
    .select('id, email, segment, domain, content_notes, created_at')
    .eq('payment_status', 'pending')
    .is('reminder_sent_at', null)
    .not('email', 'is', null)
    .lt('created_at', oneHourAgo)
    .gt('created_at', fortyEightHoursAgo)
    .limit(20); // batch size

  if (fetchError) {
    console.error('Cron fetch error:', fetchError.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  if (!briefings || briefings.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;

  for (const briefing of briefings) {
    try {
      // Extract business name from content_notes
      let businessName = 'seu negocio';
      try {
        const notes = JSON.parse(briefing.content_notes ?? '{}');
        if (notes.businessName) businessName = notes.businessName;
      } catch {}

      if (!businessName || businessName === 'seu negocio') {
        businessName = briefing.domain
          ? briefing.domain.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
          : SEGMENT_LABELS[briefing.segment ?? ''] ?? 'seu negocio';
      }

      const segmentLabel = SEGMENT_LABELS[briefing.segment ?? ''] ?? 'Negocio';
      const previewUrl = `${baseUrl}/quiz/preview?id=${briefing.id}`;
      const firstName = businessName.split(' ')[0];

      await resend.emails.send({
        from: 'SitePronto <noreply@siteprontobr.xyz>',
        to: briefing.email!,
        subject: `${firstName}, seu site ficou incrivel! Finalize agora com 25% OFF no Pix`,
        html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.07)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#004ac6 0%,#2563eb 100%);padding:36px 28px;text-align:center">
      <div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-.5px">SitePronto<span style="color:#93c5fd">.</span></div>
      <div style="margin-top:16px;font-size:40px">👋</div>
      <h1 style="margin:12px 0 0;font-size:22px;font-weight:800;color:#fff;line-height:1.3">${firstName}, seu site esta pronto!</h1>
      <p style="margin:8px 0 0;font-size:14px;color:#bfdbfe">Falta so um clique para publicar.</p>
    </div>

    <div style="padding:32px 28px">

      <!-- Preview reminder -->
      <div style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center">
        <p style="margin:0 0 6px;font-size:14px;color:#1e40af;font-weight:700">Voce criou um site para ${segmentLabel}</p>
        <p style="margin:0 0 16px;font-size:13px;color:#3b82f6">O preview gerado pela IA ainda esta salvo e esperando por voce.</p>
        <a href="${previewUrl}" style="display:inline-block;background:#004ac6;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700">Ver meu site →</a>
      </div>

      <!-- Pix discount -->
      <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:16px;padding:24px;margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <div style="font-size:28px">💰</div>
          <div>
            <p style="margin:0;font-size:16px;font-weight:800;color:#166534">25% de desconto no Pix!</p>
            <p style="margin:4px 0 0;font-size:13px;color:#15803d">De <s>R$ 300</s> por apenas <strong>R$ 225</strong></p>
          </div>
        </div>
        <p style="margin:0;font-size:12px;color:#16a34a">Pague com Pix direto na pagina — sem redirecionamento.</p>
      </div>

      <!-- Benefits -->
      <div style="margin-bottom:24px">
        <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0f172a">O que voce recebe:</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${[
            'Site profissional com textos e imagens gerados por IA',
            'Layout responsivo (funciona no celular e desktop)',
            'Publicacao inclusa — seu site no ar em 24h',
            'Suporte humano via WhatsApp',
          ].map(t => `<div style="display:flex;gap:8px;align-items:flex-start">
            <span style="color:#16a34a;font-size:16px;line-height:1">✓</span>
            <span style="font-size:13px;color:#334155">${t}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:24px">
        <a href="${previewUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:16px;font-weight:800;letter-spacing:-.01em">Publicar meu site — R$ 225 (Pix)</a>
        <p style="margin:10px 0 0;font-size:11px;color:#94a3b8">Pagamento seguro via Mercado Pago</p>
      </div>

      <!-- Urgency -->
      <div style="background:#fef2f2;border-radius:12px;padding:16px;text-align:center">
        <p style="margin:0;font-size:13px;color:#991b1b;font-weight:600">⏳ Seu preview expira em breve</p>
        <p style="margin:4px 0 0;font-size:12px;color:#dc2626">Aproveite antes que os dados sejam removidos.</p>
      </div>

      <p style="margin:24px 0 0;font-size:11px;color:#94a3b8;text-align:center">
        Voce recebeu este e-mail porque criou um site no <a href="${baseUrl}" style="color:#2563eb;text-decoration:none">SitePronto</a>.<br>
        Se nao deseja mais receber, basta ignorar — nao enviaremos novamente.
      </p>
    </div>
  </div>
</body>
</html>`,
      });

      // Mark as sent
      await supabase
        .from('briefings')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', briefing.id);

      sent++;
    } catch (err) {
      console.error(`Failed to send reminder for ${briefing.id}:`, err instanceof Error ? err.message : String(err));
    }
  }

  return NextResponse.json({ sent, total: briefings.length });
}
