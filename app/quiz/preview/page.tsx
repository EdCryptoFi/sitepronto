'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles, Monitor, Smartphone, Loader2, ArrowLeft, Wand2,
  Copy, Check, X, Palette, LayoutTemplate, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';
import { palettes, templates } from '@/lib/quiz-data';
import { analytics } from '@/lib/analytics';
import PixCheckoutModal from '@/components/PixCheckoutModal';
import { Suspense } from 'react';

function PreviewPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useQuiz();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [pixOpen, setPixOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [variantsOpen, setVariantsOpen] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variants, setVariants] = useState<{ aida: string; pas: string; fab: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const briefingId = searchParams.get('id') ?? state.briefingId ?? '';

  useEffect(() => {
    if (!briefingId) router.replace('/quiz');
    else {
      if (state.briefingId !== briefingId) {
        dispatch({ type: 'SET_BRIEFING_ID', payload: briefingId });
      }
      analytics.previewLoaded(briefingId);
    }
  }, [briefingId, state.briefingId, dispatch, router]);

  const handleOpenPix = () => {
    if (!briefingId) return;
    analytics.checkoutStart('pix');
    setPixOpen(true);
  };

  const handlePublishCard = async () => {
    if (!briefingId || checkoutLoading) return;
    analytics.checkoutStart('card');
    setCheckoutLoading(true);
    setCheckoutError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefingId,
          payerEmail: state.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setCheckoutError(data.error ?? 'Erro ao iniciar checkout.'); setCheckoutLoading(false); return; }
      if (data.payment_preference?.init_point) {
        localStorage.setItem('sitepronto-payer-email', state.email);
        localStorage.setItem('sitepronto-briefing-retry', data.briefing_id || briefingId);
        window.location.href = data.payment_preference.init_point;
      }
    } catch {
      setCheckoutError('Falha de conexão. Tente novamente.');
      setCheckoutLoading(false);
    }
  };

  const handleFetchVariants = async () => {
    setVariantsOpen(true);
    if (variants) return;
    setVariantsLoading(true);
    try {
      const res = await fetch('/api/headline-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: state.businessName,
          objective: state.objective,
          description: state.description,
          industry: state.template,
        }),
      });
      if (res.ok) setVariants(await res.json());
    } catch { /* silencioso */ } finally {
      setVariantsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegenerate = useCallback(async (newPalette?: string, newTemplate?: string) => {
    if (!briefingId || regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch('/api/regenerate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefingId,
          palette: newPalette ?? state.palette,
          template: newTemplate ?? state.template,
        }),
      });
      if (res.ok) {
        setIframeKey(k => k + 1);
      }
    } catch { /* silencioso */ } finally {
      setRegenerating(false);
    }
  }, [briefingId, regenerating, state.palette, state.template]);

  const handlePaletteChange = (paletteId: string) => {
    analytics.customize('palette', paletteId);
    dispatch({ type: 'SET_PALETTE', payload: paletteId });
    handleRegenerate(paletteId, undefined);
  };

  const handleTemplateChange = (templateId: string) => {
    analytics.customize('template', templateId);
    dispatch({ type: 'SET_TEMPLATE', payload: templateId });
    handleRegenerate(undefined, templateId);
  };

  const businessName = state.businessName || 'Meu Site';

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0f1117]">
      {/* Top bar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#1a1d27] px-4 py-2.5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary text-on-primary">
            <Sparkles size={13} />
          </span>
          <span className="text-sm font-bold text-white">SitePronto<span className="text-primary">.</span></span>
        </div>

        <div className="h-5 w-px bg-white/10" />

        {/* Site info */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{businessName}</span>
          <span className="text-label-sm text-white/30">Etapa 2 de 2</span>
        </div>

        {/* Viewport toggle */}
        <div className="mx-auto flex items-center gap-1 rounded-xl border border-white/10 bg-white/6 p-1">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${viewport === 'desktop' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            <Monitor size={14} /> <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${viewport === 'mobile' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            <Smartphone size={14} /> <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Customize button */}
        <button
          type="button"
          onClick={() => setCustomizeOpen(v => !v)}
          className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors sm:flex"
        >
          <Palette size={13} /> Personalizar {customizeOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {/* Headlines button */}
        <button
          type="button"
          onClick={handleFetchVariants}
          className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors sm:flex"
        >
          <Wand2 size={13} /> Headlines
        </button>

        {/* Back */}
        <button
          type="button"
          onClick={() => router.push('/quiz')}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Voltar
        </button>

        {/* Pix discount tag */}
        <button
          type="button"
          onClick={handleOpenPix}
          className="hidden items-center gap-1.5 rounded-full bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-400 hover:bg-green-900/50 transition-colors cursor-pointer sm:flex"
        >
          <span className="hidden md:inline">Economize R$ 75 no</span> Pix
        </button>

        {/* Publish — Pix primary */}
        <button
          type="button"
          onClick={handleOpenPix}
          className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#16a34a' }}
        >
          Publicar — R$ 225 (Pix)
        </button>
      </div>

      {/* Customization panel */}
      {customizeOpen && (
        <div className="shrink-0 border-b border-white/10 bg-[#1a1d27] px-4 py-4">
          <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2">
            {/* Palette selector */}
            <div>
              <p className="mb-2 text-xs font-semibold text-white/60 flex items-center gap-1.5">
                <Palette size={12} /> Paleta de cores
              </p>
              <div className="grid grid-cols-3 gap-2">
                {palettes.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePaletteChange(p.id)}
                    disabled={regenerating}
                    className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-all ${
                      state.palette === p.id ? 'ring-1 ring-primary bg-white/10' : 'hover:bg-white/5'
                    } ${regenerating ? 'opacity-50' : ''}`}
                  >
                    <div className="flex gap-1">
                      {p.colors.map((color) => (
                        <span key={color} className="h-4 w-4 rounded-md" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="text-[10px] font-medium text-white/70 truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Template selector */}
            <div>
              <p className="mb-2 text-xs font-semibold text-white/60 flex items-center gap-1.5">
                <LayoutTemplate size={12} /> Template
              </p>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTemplateChange(t.id)}
                    disabled={regenerating}
                    className={`rounded-xl px-3 py-2.5 text-left transition-all ${
                      state.template === t.id ? 'ring-1 ring-primary bg-white/10' : 'hover:bg-white/5'
                    } ${regenerating ? 'opacity-50' : ''}`}
                  >
                    <p className="text-xs font-semibold text-white/90">{t.name}</p>
                    <p className="text-[10px] text-white/40">{t.helper}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {regenerating && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-primary">
              <Loader2 size={12} className="animate-spin" /> Regenerando preview...
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {checkoutError && (
        <div className="shrink-0 bg-red-900/30 px-6 py-2 text-center text-sm text-red-300">
          {checkoutError}
        </div>
      )}

      {/* Pix checkout modal */}
      <PixCheckoutModal
        open={pixOpen}
        onClose={() => setPixOpen(false)}
        onPayWithCard={handlePublishCard}
        briefingId={briefingId}
        businessName={businessName}
        payerEmail={state.email}
      />

      {/* Card payment redirect overlay */}
      {checkoutLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="mx-auto max-w-sm rounded-3xl bg-[#1a1d27] p-8 text-center shadow-2xl ring-1 ring-white/10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
              <Sparkles size={28} className="text-on-primary" />
            </div>
            <h2 className="text-lg font-bold text-white">Redirecionando para pagamento</h2>
            <p className="mt-2 text-sm text-white/60">
              Voce sera redirecionado para o Mercado Pago.
            </p>
            <div className="mt-6 flex justify-center">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          </div>
        </div>
      )}

      {/* Preview area */}
      <div className="relative flex flex-1 items-start justify-center overflow-auto bg-[#0f1117] p-6">
        {briefingId ? (
          <div
            className="relative h-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 transition-all duration-300"
            style={{
              width: viewport === 'mobile' ? '390px' : '100%',
              maxWidth: '100%',
              minHeight: '600px',
            }}
          >
            <iframe
              key={`${briefingId}-${viewport}-${iframeKey}`}
              src={`/api/preview-draft/${briefingId}?v=${iframeKey}`}
              className="h-full w-full border-0 bg-white"
              style={{ minHeight: '600px' }}
              title="Preview do site"
              sandbox="allow-same-origin allow-scripts"
            />

            {/* PREVIEW watermark overlay */}
            <div
              className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-[0.06]"
              aria-hidden
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute whitespace-nowrap text-[48px] font-black tracking-widest text-white"
                  style={{
                    top: `${(i % 5) * 22}%`,
                    left: `${Math.floor(i / 5) * 30 - 10}%`,
                    transform: 'rotate(-35deg)',
                  }}
                >
                  PREVIEW
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-white/50">
            <Loader2 size={20} className="animate-spin" /> Carregando preview...
          </div>
        )}

        {/* Mobile badge */}
        {viewport === 'mobile' && (
          <div className="pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
            Mobile · 390px
          </div>
        )}
      </div>

      {/* Bottom bar — mobile CTA + customize toggle */}
      <div className="shrink-0 flex items-center gap-3 border-t border-white/10 bg-[#1a1d27] px-4 py-2.5 sm:hidden">
        <button
          type="button"
          onClick={() => setCustomizeOpen(v => !v)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/60 hover:bg-white/10"
        >
          <Palette size={13} /> Personalizar
        </button>
        <button
          type="button"
          onClick={handleFetchVariants}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/60 hover:bg-white/10"
        >
          <Wand2 size={13} /> Headlines
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleOpenPix}
          className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#16a34a' }}
        >
          Publicar — R$ 225 (Pix)
        </button>
      </div>

      {/* Headline variants panel */}
      {variantsOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={() => setVariantsOpen(false)}>
          <div
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#1a1d27] p-6 shadow-2xl ring-1 ring-white/10 m-0 sm:m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-white">Outras opções de headline</h3>
              </div>
              <button type="button" onClick={() => setVariantsOpen(false)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <p className="mb-4 text-xs text-white/50">3 abordagens diferentes geradas pela IA. Copie a que mais combina.</p>

            {variantsLoading && (
              <div className="flex items-center justify-center py-8 gap-2 text-white/50 text-sm">
                <Loader2 size={16} className="animate-spin" /> Gerando variantes…
              </div>
            )}

            {!variantsLoading && variants && (
              <div className="space-y-3">
                {([
                  { key: 'aida', label: 'AIDA', desc: 'Atenção → Desejo → Ação', text: variants.aida },
                  { key: 'pas',  label: 'PAS',  desc: 'Problema → Solução',      text: variants.pas },
                  { key: 'fab',  label: 'FAB',  desc: 'Característica → Benefício', text: variants.fab },
                ] as const).map(({ key, label, desc, text }) => (
                  <div key={key} className="rounded-2xl bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">{label}</span>
                      <span className="text-[10px] text-white/40">{desc}</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">&ldquo;{text}&rdquo;</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(text, key)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50 hover:text-white transition-colors"
                    >
                      {copied === key ? <><Check size={11} className="text-green-400" /> Copiado!</> : <><Copy size={11} /> Copiar</>}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!variantsLoading && !variants && (
              <p className="text-center text-sm text-white/40 py-4">Não foi possível gerar variantes. Tente novamente.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizPreview() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0f1117] text-white/50">
        <Loader2 size={24} className="animate-spin" />
      </div>
    }>
      <PreviewPageInner />
    </Suspense>
  );
}
