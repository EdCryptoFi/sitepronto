import Link from 'next/link';
import { Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { PALETTE_STYLES } from '@/lib/palette-styles';

const SEGMENT_LABELS: Record<string, string> = {
  restaurante: 'Restaurante', loja: 'Loja', clinica: 'Clínica',
  servicos: 'Prestação de Serviços', educacao: 'Portfólio', outro: 'Negócio',
};

async function getBriefing(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('briefings')
    .select('id, segment, palette, template, selected_modules, domain, payment_status, created_at')
    .eq('id', id)
    .single();
  return data;
}

export default async function PreviewPage({ params }: { params: Promise<{ briefingId: string }> }) {
  const { briefingId } = await params;
  const briefing = await getBriefing(briefingId);

  if (!briefing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: '#0f1117', color: '#fff' }}>
        <h1 className="text-2xl font-bold">Prévia não encontrada</h1>
        <p className="text-white/60">O link pode estar incorreto ou o briefing foi removido.</p>
        <Link href="/" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">Voltar ao início</Link>
      </main>
    );
  }

  const paletteId = briefing.palette ?? 'azul-editorial';
  const colors = PALETTE_STYLES[paletteId] ?? PALETTE_STYLES['azul-editorial'];
  const segmentLabel = SEGMENT_LABELS[briefing.segment ?? ''] ?? 'Negócio';
  const businessName = briefing.domain
    ? briefing.domain.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : segmentLabel;
  const isPending = briefing.payment_status !== 'approved';

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: '#0f1117' }}>
      <header
        className="flex shrink-0 items-center justify-between gap-4 px-6 py-3 text-white"
        style={{ background: colors.primary }}
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles size={16} />
          Prévia do site · SitePronto
        </div>
        <div className="flex items-center gap-3">
          {isPending && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs">
              <Clock size={12} />
              Em preparação
            </div>
          )}
          <span className="text-sm font-medium opacity-80">{businessName}</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/30"
        >
          <ArrowLeft size={12} /> Voltar
        </Link>
      </header>

      <div className="relative flex flex-1 items-start justify-center overflow-auto p-4">
        <div
          className="h-full w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10"
          style={{ minHeight: '500px' }}
        >
          <iframe
            src={`/api/preview-draft/${briefingId}`}
            className="h-full w-full border-0 bg-white"
            style={{ minHeight: '500px' }}
            title="Preview do site"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}