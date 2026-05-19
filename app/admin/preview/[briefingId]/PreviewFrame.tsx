'use client';

import { useState } from 'react';
import { Monitor, Tablet, Smartphone, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORTS: { id: Viewport; label: string; width: string; icon: React.ReactNode }[] = [
  { id: 'desktop', label: 'Desktop', width: '100%',  icon: <Monitor size={15} /> },
  { id: 'tablet',  label: 'Tablet',  width: '768px', icon: <Tablet size={15} /> },
  { id: 'mobile',  label: 'Mobile',  width: '390px', icon: <Smartphone size={15} /> },
];

type BriefingMeta = {
  id: string;
  domain: string | null;
  template: string | null;
  palette: string | null;
  selected_modules: string[] | null;
};

const TEMPLATE_LABELS: Record<string, string> = {
  restaurant: 'Restaurante & Estética',
  farmacy: 'Clínica & Saúde',
  store: 'Loja & Comércio',
  portfolio: 'Portfólio & Serviços',
};

const PALETTE_COLORS: Record<string, string> = {
  'azul-editorial': '#004ac6',
  'verde-servico': '#0f766e',
  'vinho-premium': '#7f1d1d',
  'minimal': '#6b7280',
  'vibrant': '#eab308',
  'corporate': '#002855',
  'nature': '#059669',
  'tech': '#111827',
  'elegant': '#2b1b17',
};

export default function PreviewFrame({ briefing }: { briefing: BriefingMeta }) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const current = VIEWPORTS.find((v) => v.id === viewport)!;
  const paletteColor = PALETTE_COLORS[briefing.palette ?? ''] ?? '#004ac6';
  const templateLabel = TEMPLATE_LABELS[briefing.template ?? ''] ?? briefing.template ?? '—';
  const modules: string[] = briefing.selected_modules ?? [];
  const domain = briefing.domain;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0f1117]">
      {/* ── Top bar ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#1a1d27] px-4 py-2.5">
        {/* Back */}
        <Link
          href="/admin/briefings"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} /> Voltar
        </Link>

        <div className="h-5 w-px bg-white/10" />

        {/* Site info */}
        <div className="flex items-center gap-2.5">
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: paletteColor, boxShadow: `0 0 8px ${paletteColor}88` }}
          />
          <span className="text-sm font-semibold text-white">
            {domain ? `${domain}.com.br` : `Pedido ${briefing.id.slice(0, 8).toUpperCase()}`}
          </span>
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/50">
            {templateLabel}
          </span>
          {modules.length > 0 && (
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/50">
              {modules.length} módulo{modules.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* ── Viewport switcher (center) ── */}
        <div className="mx-auto flex items-center gap-1 rounded-xl bg-white/6 p-1 border border-white/8">
          {VIEWPORTS.map((vp) => (
            <button
              key={vp.id}
              type="button"
              onClick={() => setViewport(vp.id)}
              title={vp.label}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                vp.id === viewport
                  ? 'bg-white/15 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {vp.icon}
              <span className="hidden sm:inline">{vp.label}</span>
              {vp.id !== 'desktop' && (
                <span className="hidden md:inline opacity-50">({vp.width})</span>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <a
          href={`/api/admin/preview-site/${briefing.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ExternalLink size={14} /> Abrir em aba
        </a>
        <a
          href={`/api/admin/generate-site/${briefing.id}`}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <Download size={14} /> Baixar ZIP
        </a>
      </div>

      {/* ── Preview area ── */}
      <div className="relative flex flex-1 items-start justify-center overflow-auto bg-[#0f1117] p-6">
        <div
          className="h-full min-h-[600px] overflow-hidden rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-300 ring-1 ring-white/10"
          style={{ width: current.width, maxWidth: '100%', minWidth: viewport === 'desktop' ? 'unset' : current.width }}
        >
          <iframe
            key={viewport}
            src={`/api/admin/preview-site/${briefing.id}`}
            className="h-full w-full border-0 bg-white"
            style={{ minHeight: '600px' }}
            title="Site preview"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>

        {/* Viewport label badge */}
        {viewport !== 'desktop' && (
          <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm border border-white/10">
            {current.label} · {current.width}
          </div>
        )}
      </div>
    </div>
  );
}
