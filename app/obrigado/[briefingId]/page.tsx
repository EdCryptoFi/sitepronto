import Link from 'next/link';
import { CheckCircle2, ExternalLink, Sparkles, Share2, MessageCircle, Download } from 'lucide-react';
import { getBriefingById } from '@/lib/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';
import Countdown from './Countdown';
import EmailSender from './EmailSender';

export default async function ObrigadoPage({ params }: { params: Promise<{ briefingId: string }> }) {
  const { briefingId } = await params;

  const briefing = await getBriefingById(briefingId);

  const isApproved = briefing?.payment_status === 'approved';
  const deliveryTarget = briefing?.created_at
    ? new Date(new Date(briefing.created_at).getTime() + 24 * 3600 * 1000).toISOString()
    : new Date(Date.now() + 24 * 3600 * 1000).toISOString();

  const SEGMENT_LABELS: Record<string, string> = {
    restaurante: 'Restaurante', loja: 'Loja', clinica: 'Clínica',
    servicos: 'Prestação de Serviços', educacao: 'Portfólio', outro: 'Negócio',
  };
  const segmentLabel = SEGMENT_LABELS[briefing?.segment ?? ''] ?? 'seu negócio';

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
          Estamos montando o site de <strong className="text-on-surface">{segmentLabel}</strong> com
          o visual que você escolheu. Tudo pronto em até 24 horas.
        </p>

        {/* Countdown */}
        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl border border-outline-variant bg-surface-low px-6 py-4">
            <Countdown targetIso={deliveryTarget} />
          </div>
        </div>

        {/* Steps */}
        <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {[
            { step: '1', title: 'Análise', desc: 'Revisamos as informações do seu briefing.' },
            { step: '2', title: 'Montagem', desc: 'Construímos o site com o template e visual escolhidos.' },
            { step: '3', title: 'Entrega', desc: 'Você recebe o link para revisar e aprovar.' },
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

        {/* CTA entrega */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {isApproved ? (
            <a
              href={`/api/download-site/${briefingId}`}
              className="btn-primary text-base"
            >
              <Download size={18} /> Baixar meu site (.zip)
            </a>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl border border-outline-variant px-6 py-3 text-body-md text-on-surface-variant">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
              Aguardando confirmação do pagamento…
            </div>
          )}
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
            href="https://wa.me/5511999999999?text=Olá!%20Acabei%20de%20contratar%20o%20SitePronto.%20Meu%20pedido%20é%20[BRIEFING_ID]"
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

        <p className="mt-8 text-label-sm text-on-surface-variant">
          Pedido #{briefingId.slice(0, 8).toUpperCase()} · Confirmação enviada por e-mail.
        </p>
      </section>
    </main>
  );
}
