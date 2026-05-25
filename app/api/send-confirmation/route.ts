import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SEGMENT_LABELS: Record<string, string> = {
  restaurante: 'Restaurante', loja: 'Loja', clinica: 'Clínica',
  servicos: 'Prestação de Serviços', educacao: 'Portfólio / Educação',
  veterinaria: 'Clínica Veterinária', petshop: 'Pet Shop',
  academia: 'Academia / Fitness', imobiliaria: 'Imobiliária',
  contabilidade: 'Contabilidade', tecnologia: 'Tecnologia',
  farmacia: 'Farmácia', turismo: 'Turismo / Pousada',
  transporte: 'Transporte / Logística', fotografia: 'Fotografia',
  outro: 'Negócio',
};

const PALETTE_LABELS: Record<string, string> = {
  'azul-editorial': 'Azul Editorial', 'verde-servico': 'Verde Serviço',
  'vinho-premium': 'Vinho Premium', minimal: 'Minimalista',
  vibrant: 'Vibrante', corporate: 'Corporativo', nature: 'Nature',
  tech: 'Tech Dark', elegant: 'Elegante',
};

const TEMPLATE_LABELS: Record<string, string> = {
  modern: 'Moderno', classic: 'Clássico', bold: 'Arrojado',
};

const MODULE_LABELS: Record<string, string> = {
  galeria: 'Galeria de fotos', faq: 'Perguntas frequentes',
  sobre: 'Seção Sobre', depoimentos: 'Depoimentos',
  contato: 'Formulário de contato', catalogo: 'Catálogo de produtos',
  agendamento: 'Agendamento online', whatsapp: 'Botão WhatsApp',
  servicos: 'Lista de serviços', portfolio: 'Portfólio', blog: 'Blog',
};

export async function POST(request: NextRequest) {
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

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: 'Serviço indisponível.' }, { status: 500 });
    }

    const supabase = createClient(url, key);
    const { data: briefing } = await supabase
      .from('briefings')
      .select('id, segment, palette, template, selected_modules, domain, content_notes, whatsapp_number, payment_status, referral_code')
      .eq('id', briefingId)
      .single();

    if (!briefing) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    if (briefing.payment_status === 'rejected') {
      return NextResponse.json({ error: 'Pagamento recusado.' }, { status: 402 });
    }

    // Extract business name from content_notes
    let businessName = briefing.domain
      ? briefing.domain.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      : SEGMENT_LABELS[briefing.segment] ?? 'seu negócio';
    try {
      const notes = JSON.parse(briefing.content_notes ?? '{}');
      if (notes.businessName) businessName = notes.businessName;
    } catch {}

    const segmentLabel = SEGMENT_LABELS[briefing.segment ?? ''] ?? 'Negócio';
    const paletteLabel = PALETTE_LABELS[briefing.palette ?? ''] ?? briefing.palette ?? '—';
    const templateLabel = TEMPLATE_LABELS[briefing.template ?? ''] ?? briefing.template ?? '—';
    const modules: string[] = Array.isArray(briefing.selected_modules) ? briefing.selected_modules : [];
    const modulesHtml = modules.length
      ? modules.map((m) => `<span style="display:inline-block;background:#dbe6ff;color:#004ac6;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;margin:3px">${MODULE_LABELS[m] ?? m}</span>`).join(' ')
      : '<span style="font-size:13px;color:#64748b">Apenas as seções principais</span>';

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[send-confirmation] RESEND_API_KEY não configurado — e-mail não enviado');
      return NextResponse.json({ ok: true, simulated: true });
    }

    const resend = new Resend(apiKey);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sitepronto.com';
    const previewUrl = `${baseUrl}/preview/${briefingId}`;
    const orderId = briefingId.slice(0, 8).toUpperCase();

    await resend.emails.send({
      from: 'SitePronto <noreply@siteprontobr.xyz>',
      to: email,
      subject: '✅ Pagamento confirmado — SitePronto está montando seu site!',
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.07)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#004ac6 0%,#2563eb 100%);padding:40px 32px;text-align:center">
      <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.5px">SitePronto<span style="color:#93c5fd">.</span></div>
      <div style="margin-top:20px;width:64px;height:64px;background:rgba(255,255,255,.15);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px">🎉</div>
      <h1 style="margin:16px 0 0;font-size:26px;font-weight:800;color:#fff;line-height:1.2">Pagamento confirmado!</h1>
      <p style="margin:10px 0 0;font-size:15px;color:#bfdbfe">Nossa equipe já está montando o seu site.</p>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px">

      <!-- Mensagem principal -->
      <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:16px;padding:28px;margin-bottom:32px">
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#166534">Tudo certo, ${businessName}!</p>
        <p style="margin:0;font-size:14px;color:#15803d;line-height:1.6">
          Recebemos seu pedido e nossa equipe está preparando o site personalizado para o seu negócio.
          <strong>Em até 24 horas úteis</strong> você vai receber o site pronto, publicado no seu domínio.
        </p>
      </div>

      <!-- Resumo do pedido -->
      <div style="border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:28px">
        <h2 style="margin:0 0 18px;font-size:16px;font-weight:700;color:#0f172a">Resumo do seu pedido</h2>

        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;width:40%">Pedido</td>
            <td style="padding:8px 0;font-size:13px;font-weight:600;color:#0f172a">#${orderId}</td>
          </tr>
          <tr style="border-top:1px solid #f1f5f9">
            <td style="padding:8px 0;font-size:13px;color:#64748b">Segmento</td>
            <td style="padding:8px 0;font-size:13px;font-weight:600;color:#0f172a">${segmentLabel}</td>
          </tr>
          <tr style="border-top:1px solid #f1f5f9">
            <td style="padding:8px 0;font-size:13px;color:#64748b">Identidade visual</td>
            <td style="padding:8px 0;font-size:13px;font-weight:600;color:#0f172a">${paletteLabel}</td>
          </tr>
          <tr style="border-top:1px solid #f1f5f9">
            <td style="padding:8px 0;font-size:13px;color:#64748b">Layout</td>
            <td style="padding:8px 0;font-size:13px;font-weight:600;color:#0f172a">${templateLabel}</td>
          </tr>
          ${modules.length ? `<tr style="border-top:1px solid #f1f5f9">
            <td style="padding:8px 0;font-size:13px;color:#64748b;vertical-align:top">Seções extras</td>
            <td style="padding:8px 4px">${modulesHtml}</td>
          </tr>` : ''}
        </table>
      </div>

      <!-- Preview CTA -->
      <div style="margin-bottom:28px;text-align:center">
        <p style="margin:0 0 14px;font-size:14px;color:#475569">Veja como ficou a prévia do seu site:</p>
        <a href="${previewUrl}" style="display:inline-block;background:#004ac6;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:-.01em">👁️ Ver prévia do meu site</a>
      </div>

      <!-- O que acontece agora -->
      <div style="border-top:1px solid #f1f5f9;padding-top:28px;margin-bottom:28px">
        <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0f172a">O que acontece agora?</h2>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;gap:14px;align-items:flex-start">
            <div style="min-width:28px;height:28px;border-radius:50%;background:#dbe6ff;color:#004ac6;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">1</div>
            <div>
              <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a">Nossa equipe revisa o seu briefing</p>
              <p style="margin:4px 0 0;font-size:13px;color:#64748b">Analisamos as informações do seu negócio e personalizamos os textos e imagens.</p>
            </div>
          </div>
          <div style="display:flex;gap:14px;align-items:flex-start">
            <div style="min-width:28px;height:28px;border-radius:50%;background:#dbe6ff;color:#004ac6;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">2</div>
            <div>
              <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a">Montamos e publicamos o seu site</p>
              <p style="margin:4px 0 0;font-size:13px;color:#64748b">Em até 24 horas úteis seu site estará no ar, pronto para receber clientes.</p>
            </div>
          </div>
          <div style="display:flex;gap:14px;align-items:flex-start">
            <div style="min-width:28px;height:28px;border-radius:50%;background:#dbe6ff;color:#004ac6;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">3</div>
            <div>
              <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a">Você recebe o link e aprova</p>
              <p style="margin:4px 0 0;font-size:13px;color:#64748b">Entramos em contato por WhatsApp ou e-mail com o link final para você conferir.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Suporte -->
      <div style="background:#f8fafc;border-radius:12px;padding:20px;text-align:center">
        <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#0f172a">Ficou com alguma dúvida?</p>
        <p style="margin:0 0 14px;font-size:13px;color:#475569">Nossa equipe está disponível pelo WhatsApp.</p>
        <a href="https://wa.me/5519981286209?text=Olá!%20Fiz%20um%20pedido%20no%20SitePronto.%20Pedido%3A%20%23${orderId}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:10px 24px;border-radius:10px;font-size:13px;font-weight:600">💬 Falar no WhatsApp</a>
      </div>

      <p style="margin:28px 0 0;font-size:12px;color:#94a3b8;text-align:center">
        Pedido #${orderId} · <a href="${baseUrl}" style="color:#2563eb;text-decoration:none">sitepronto.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    });

    // Admin notification — separate email with full details + download link
    const downloadUrl = `${baseUrl}/api/download-site/${briefingId}`;
    const whatsappClient = briefing.whatsapp_number
      ? `https://wa.me/${briefing.whatsapp_number.replace(/\D/g, '')}`
      : null;

    await resend.emails.send({
      from: 'SitePronto <noreply@siteprontobr.xyz>',
      to: 'cryptolairbr@gmail.com',
      subject: `🛎️ Novo pedido — ${businessName} (#${orderId})`,
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:32px auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155">

    <div style="background:#004ac6;padding:24px 28px">
      <p style="margin:0;font-size:11px;font-weight:700;color:#93c5fd;text-transform:uppercase;letter-spacing:.1em">SitePronto · Notificação Interna</p>
      <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#fff">🛎️ Novo pedido pago!</h1>
    </div>

    <div style="padding:28px">

      <!-- Cliente -->
      <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em">Dados do cliente</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#94a3b8;width:40%">Pedido</td>
            <td style="padding:6px 0;font-size:13px;font-weight:700;color:#f1f5f9">#${orderId}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#94a3b8">Negócio</td>
            <td style="padding:6px 0;font-size:13px;font-weight:700;color:#f1f5f9">${businessName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#94a3b8">E-mail</td>
            <td style="padding:6px 0;font-size:13px;font-weight:700;color:#93c5fd">${email}</td>
          </tr>
          ${whatsappClient ? `<tr>
            <td style="padding:6px 0;font-size:13px;color:#94a3b8">WhatsApp</td>
            <td style="padding:6px 0"><a href="${whatsappClient}?text=Olá!%20Seu%20site%20está%20pronto.%20Pedido%20%23${orderId}" style="font-size:13px;font-weight:700;color:#4ade80;text-decoration:none">${briefing.whatsapp_number}</a></td>
          </tr>` : ''}
        </table>
      </div>

      <!-- Pedido -->
      <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em">Configuração do site</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#94a3b8;width:40%">Segmento</td>
            <td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9">${segmentLabel}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#94a3b8">Paleta</td>
            <td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9">${paletteLabel}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#94a3b8">Layout</td>
            <td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9">${templateLabel}</td>
          </tr>
          ${modules.length ? `<tr>
            <td style="padding:6px 0;font-size:13px;color:#94a3b8;vertical-align:top">Extras</td>
            <td style="padding:6px 4px">${modules.map(m => `<span style="display:inline-block;background:#1e3a5f;color:#93c5fd;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;margin:2px">${MODULE_LABELS[m] ?? m}</span>`).join(' ')}</td>
          </tr>` : ''}
        </table>
      </div>

      <!-- Ações -->
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
        <a href="${downloadUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:700">⬇️ Baixar arquivos (.zip)</a>
        <a href="${previewUrl}" style="display:inline-block;background:#1e3a5f;color:#93c5fd;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600">👁️ Ver prévia</a>
      </div>

      <p style="margin:0;font-size:12px;color:#475569;text-align:center">Briefing ID: ${briefingId}</p>
    </div>
  </div>
</body>
</html>`,
    });

    // Referral commission notification
    if (briefing.referral_code) {
      const { data: reseller } = await supabase
        .from('resellers')
        .select('name, email, commission_value')
        .eq('code', briefing.referral_code)
        .single();

      if (reseller) {
        const commission = reseller.commission_value ?? 50;
        const panelUrl = `${baseUrl}/painel/${briefing.referral_code}`;
        const commissionHtml = (to: string, toName: string) => `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07)">
    <div style="background:linear-gradient(135deg,#059669,#14b8a6);padding:28px 28px 24px;text-align:center">
      <div style="font-size:36px">💰</div>
      <h1 style="margin:10px 0 0;font-size:22px;font-weight:800;color:#fff">Comissão gerada!</h1>
      <p style="margin:8px 0 0;font-size:14px;color:#a7f3d0">Uma venda foi atribuída ao seu link de revendedor</p>
    </div>
    <div style="padding:28px">
      <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
        <p style="margin:0 0 4px;font-size:13px;color:#166534;font-weight:600">Comissão a receber</p>
        <p style="margin:0;font-size:36px;font-weight:800;color:#059669">R$ ${commission},00</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr>
          <td style="padding:7px 0;font-size:13px;color:#64748b;width:45%">Pedido</td>
          <td style="padding:7px 0;font-size:13px;font-weight:700;color:#0f172a">#${orderId}</td>
        </tr>
        <tr style="border-top:1px solid #f1f5f9">
          <td style="padding:7px 0;font-size:13px;color:#64748b">Segmento</td>
          <td style="padding:7px 0;font-size:13px;font-weight:600;color:#0f172a">${segmentLabel}</td>
        </tr>
        <tr style="border-top:1px solid #f1f5f9">
          <td style="padding:7px 0;font-size:13px;color:#64748b">Revendedor</td>
          <td style="padding:7px 0;font-size:13px;font-weight:600;color:#0f172a">${reseller.name}</td>
        </tr>
      </table>
      <div style="text-align:center">
        <a href="${panelUrl}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:700">📊 Ver meu painel</a>
      </div>
      <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;text-align:center">
        ${toName} · <a href="${baseUrl}" style="color:#059669;text-decoration:none">sitepronto.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>`;

        await Promise.all([
          resend.emails.send({
            from: 'SitePronto <noreply@siteprontobr.xyz>',
            to: reseller.email,
            subject: `💰 Você ganhou R$${commission} de comissão! — SitePronto`,
            html: commissionHtml(reseller.email, reseller.name),
          }),
          resend.emails.send({
            from: 'SitePronto <noreply@siteprontobr.xyz>',
            to: 'cryptolairbr@gmail.com',
            subject: `🤝 Venda via revendedor ${reseller.name} (#${orderId})`,
            html: commissionHtml('cryptolairbr@gmail.com', 'Admin'),
          }),
        ]);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    console.error('[send-confirmation] erro ao enviar e-mail');
    return NextResponse.json({ error: 'Erro ao enviar e-mail' }, { status: 500 });
  }
}
