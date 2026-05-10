import Link from 'next/link';
import { ShoppingBag, Wrench, Image, Building2, Phone, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { getBriefingById } from '@/lib/supabase/client';
import { palettes, quizModules } from '@/lib/quiz-data';

const SEGMENT_LABELS: Record<string, string> = {
  restaurante: 'Restaurante', loja: 'Loja', clinica: 'Clínica',
  servicos: 'Prestação de Serviços', educacao: 'Portfólio', outro: 'Negócio',
};

const MODULE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  servicos: ShoppingBag,
  sobre: Building2,
  contato: Phone,
  galeria: Image,
  depoimentos: CheckCircle2,
  faq: Wrench,
};

const PALETTE_STYLES: Record<string, { primary: string; accent: string; light: string }> = {
  'azul-editorial': { primary: '#004ac6', accent: '#2563eb', light: '#dbe6ff' },
  'verde-servico':  { primary: '#0f766e', accent: '#14b8a6', light: '#ccfbf1' },
  'vinho-premium':  { primary: '#7f1d1d', accent: '#be123c', light: '#ffe4e6' },
  minimal:          { primary: '#6b7280', accent: '#9ca3af', light: '#f3f4f6' },
  vibrant:          { primary: '#004ac6', accent: '#eab308', light: '#fef9c3' },
  corporate:        { primary: '#002855', accent: '#004ac6', light: '#dbe1ff' },
  nature:           { primary: '#059669', accent: '#f97316', light: '#d1fae5' },
  tech:             { primary: '#111827', accent: '#06b6d4', light: '#ecfeff' },
  elegant:          { primary: '#2b1b17', accent: '#b58e58', light: '#f5f1ed' },
};

export default async function PreviewPage({ params }: { params: Promise<{ briefingId: string }> }) {
  const { briefingId } = await params;
  const briefing = await getBriefingById(briefingId);

  if (!briefing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-headline-md font-bold">Prévia não encontrada</h1>
        <p className="text-body-md text-on-surface-variant">
          O link pode estar incorreto ou o pedido ainda está sendo processado.
        </p>
        <Link href="/" className="btn-accent">Voltar ao início</Link>
      </main>
    );
  }

  const paletteId = briefing.palette ?? 'azul-editorial';
  const colors = PALETTE_STYLES[paletteId] ?? PALETTE_STYLES['azul-editorial'];
  const paletteInfo = palettes.find((p) => p.id === paletteId);
  const segmentLabel = SEGMENT_LABELS[briefing.segment ?? ''] ?? 'Negócio';
  const selectedMods = (briefing.selected_modules ?? []) as string[];
  const moduleInfos = quizModules.filter((m) => selectedMods.includes(m.id));

  const businessName = briefing.domain
    ? briefing.domain.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : segmentLabel;

  const isPending = briefing.payment_status !== 'approved';

  return (
    <main className="min-h-screen bg-surface pb-20">
      {/* Banner de prévia */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-3 text-white"
        style={{ background: colors.primary }}
      >
        <div className="flex items-center gap-2 text-label-md font-semibold">
          <Sparkles size={16} />
          Prévia do seu site · SitePronto
        </div>
        {isPending && (
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-label-sm">
            <Clock size={12} />
            Em preparação — até 24h
          </div>
        )}
        <Link
          href={`/obrigado/${briefingId}`}
          className="rounded-xl bg-white/20 px-3 py-1 text-label-sm font-semibold hover:bg-white/30"
        >
          ← Meu pedido
        </Link>
      </div>

      {/* Mock Hero */}
      <section
        className="flex min-h-[420px] flex-col items-center justify-center gap-6 px-6 py-20 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}
      >
        <div
          className="rounded-2xl px-4 py-2 text-label-md font-semibold"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          {segmentLabel}
        </div>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight">
          {businessName}
        </h1>
        <p className="max-w-lg text-lg opacity-80">
          Site profissional criado pela SitePronto · em construção
        </p>
        {selectedMods.includes('contato') && (
          <button
            className="flex items-center gap-2 rounded-2xl px-6 py-3 text-label-md font-semibold"
            style={{ background: '#25d366', color: '#fff' }}
          >
            <Phone size={18} /> Fale pelo WhatsApp
          </button>
        )}
      </section>

      {/* Módulos */}
      {moduleInfos.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-10 text-center">
            <span
              className="inline-block rounded-full px-4 py-1.5 text-label-md font-semibold"
              style={{ background: colors.light, color: colors.primary }}
            >
              O que seu site terá
            </span>
            <h2 className="mt-4 text-headline-md font-bold">
              {moduleInfos.length} módulo{moduleInfos.length > 1 ? 's' : ''} incluído{moduleInfos.length > 1 ? 's' : ''}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moduleInfos.map((mod) => {
              const Icon = MODULE_ICONS[mod.id] ?? CheckCircle2;
              return (
                <div key={mod.id} className="card flex flex-col gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: colors.light }}
                  >
                    <Icon size={24} style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <p className="text-label-md font-semibold">{mod.name}</p>
                    <p className="mt-1 text-label-sm text-on-surface-variant">{mod.helper}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Paleta visual */}
      <section
        className="mx-auto max-w-4xl px-6 py-12"
        style={{ background: colors.light, borderRadius: '24px', margin: '0 24px 48px' }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-label-md font-semibold" style={{ color: colors.primary }}>
            Identidade visual
          </span>
          <h3 className="text-title-lg font-bold">{paletteInfo?.name}</h3>
          <p className="text-label-md text-on-surface-variant">{paletteInfo?.helper}</p>
          <div className="flex gap-3">
            {[colors.primary, colors.accent, colors.light].map((c) => (
              <div
                key={c}
                className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Rodapé mock */}
      <footer
        className="py-10 text-center text-white"
        style={{ background: colors.primary }}
      >
        <p className="text-label-md font-semibold">{businessName}</p>
        <p className="mt-1 text-label-sm opacity-70">
          {briefing.domain ? `${briefing.domain}.com.br` : 'Domínio a definir'}
          {' · '}Site criado com SitePronto
        </p>
      </footer>
    </main>
  );
}
