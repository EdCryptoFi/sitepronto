import Link from 'next/link';
import { CheckCircle2, ExternalLink, Sparkles, Share2, MessageCircle } from 'lucide-react';
import { getBriefingById } from '@/lib/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';
import Countdown from './Countdown';
import EmailSender from './EmailSender';
import WATemplates from './WATemplates';

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

export default async function ObrigadoPage({ params }: { params: Promise<{ briefingId: string }> }) {
  const { briefingId } = await params;

  const briefing = await getBriefingById(briefingId);

  const deliveryTarget = briefing?.created_at
    ? new Date(new Date(briefing.created_at).getTime() + 24 * 3600 * 1000).toISOString()
    : new Date(Date.now() + 24 * 3600 * 1000).toISOString();

  const segmentLabel = SEGMENT_LABELS[briefing?.segment ?? ''] ?? 'seu negócio';
  const paletteLabel = PALETTE_LABELS[briefing?.palette ?? ''] ?? briefing?.palette ?? '—';
  const templateLabel = TEMPLATE_LABELS[briefing?.template ?? ''] ?? briefing?.template ?? '—';
  const modules: string[] = Array.isArray(briefing?.selected_modules) ? briefing.selected_modules : [];

  return (
    <main className="relative min-h-screen pb-20 pt-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-50"
        style={{
          background: 'radial-gradient(60% 100% at 50% 0%, rgba(0, 74, 198, 0.08), transparent 70%)',
        }}
      />

      <EmailSender briefingId={briefingId} />

      {/* Header */}
      <div className="relative mx-auto flex max-w-3xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-on-primary">
            <Sparkles size={16} />
          </span>
          <span className="text-title-lg font-bold tracking-tight">
            SitePronto<span className="text-primary">.</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <section className="relative mx-auto mt-16 max-w-2xl px-6 text-center">
        {/* Ícone de sucesso */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary shadow-architectural-lg">
          <CheckCircle2 size={40} className="text-on-primary" />
        </div>

        <h1 className="text-headline-lg font-bold">
          Pagamento confirmado!
        </h1>
        <p className="mt-3 text-body-lg text-on-surface-variant">
          Nossa equipe está montando o site de <strong className="text-on-surface">{segmentLabel}</strong> com
          o visual que você escolheu. Tudo pronto em até 24 horas úteis.
        </p>

        {/* Countdown */}
        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl border border-outline-variant bg-surface-low px-6 py-4">
            <Countdown targetIso={deliveryTarget} />
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="mt-10 rounded-2xl border border-outline-variant bg-surface-low p-6 text-left">
          <h2 className="mb-4 text-label-lg font-semibold text-on-surface">Resumo do seu pedido</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <dt className="text-label-sm text-on-surface-variant">Pedido</dt>
            <dd className="text-label-sm font-semibold text-on-surface">#{briefingId.slice(0, 8).toUpperCase()}</dd>

            <dt className="text-label-sm text-on-surface-variant">Segmento</dt>
            <dd className="text-label-sm font-semibold text-on-surface">{segmentLabel}</dd>

            <dt className="text-label-sm text-on-surface-variant">Identidade visual</dt>
            <dd className="text-label-sm font-semibold text-on-surface">{paletteLabel}</dd>

            <dt className="text-label-sm text-on-surface-variant">Layout</dt>
            <dd className="text-label-sm font-semibold text-on-surface">{templateLabel}</dd>

            {modules.length > 0 && (
              <>
                <dt className="text-label-sm text-on-surface-variant">Seções extras</dt>
                <dd className="flex flex-wrap gap-1">
                  {modules.map((m) => (
                    <span key={m} className="rounded-full bg-primary/10 px-2 py-0.5 text-label-xs font-semibold text-primary">
                      {MODULE_LABELS[m] ?? m}
                    </span>
                  ))}
                </dd>
              </>
            )}
          </dl>
        </div>

        {/* Steps */}
        <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {[
            { step: '1', title: 'Análise', desc: 'Revisamos as informações do seu briefing e personalizamos os textos.' },
            { step: '2', title: 'Montagem', desc: 'Construímos e publicamos o site com o template e visual escolhidos.' },
            { step: '3', title: 'Entrega', desc: 'Você recebe o link final por WhatsApp ou e-mail para conferir.' },
          ].map((item) => (
            <div key={item.step} className="card flex flex-col gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-label-md font-bold text-on-primary">
                {item.step}
              </div>
              <div>
                <p className="text-label-md font-semibold">{item.title}</p>
                <p className="mt-1 text-label-sm text-on-surface-variant">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <div className="flex items-center gap-2 rounded-2xl border border-outline-variant px-6 py-3 text-body-md text-on-surface-variant">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
            Nossa equipe entra em contato em até 24h
          </div>
          <Link
            href={`/preview/${briefingId}`}
            className="btn-ghost"
          >
            Ver prévia <ExternalLink size={16} />
          </Link>
        </div>

        {/* WhatsApp contact + Share */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`https://wa.me/5519981286209?text=Olá!%20Acabei%20de%20contratar%20o%20SitePronto.%20Meu%20pedido%20é%20%23${briefingId.slice(0, 8).toUpperCase()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle size={16} /> Fale conosco no WhatsApp
          </a>
          <a
            href={`https://wa.me/?text=Acabei%20de%20criar%20meu%20site%20com%20o%20SitePronto!%20%E2%9C%A8%20https://sitepronto.com/preview/${briefingId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-white/5"
          >
            <Share2 size={16} /> Compartilhar no WhatsApp
          </a>
        </div>

        {/* WhatsApp message templates */}
        <WATemplates
          businessName={briefing?.domain ?? ''}
          segment={briefing?.segment ?? ''}
          objective={briefing?.goal ?? ''}
        />

        <p className="mt-8 text-label-sm text-on-surface-variant">
          Pedido #{briefingId.slice(0, 8).toUpperCase()} · Confirmação enviada por e-mail.
        </p>
      </section>
    </main>
  );
}
