'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Monitor, Smartphone, Loader2, ArrowLeft } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';
import { Suspense } from 'react';

function PreviewSandboxInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useQuiz();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const briefingId = searchParams.get('id') ?? state.briefingId ?? '';

  useEffect(() => {
    if (!briefingId) router.replace('/quiz/etapa-3');
    else if (state.briefingId !== briefingId) {
      dispatch({ type: 'SET_BRIEFING_ID', payload: briefingId });
    }
  }, [briefingId, state.briefingId, dispatch, router]);

  const handlePublish = async () => {
    if (!briefingId || checkoutLoading) return;
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
          {state.template && (
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/50 capitalize">{state.template}</span>
          )}
        </div>

        {/* Viewport toggle — center */}
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

        {/* Back */}
        <button
          type="button"
          onClick={() => router.push('/quiz/etapa-3')}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Voltar
        </button>

        {/* Pix discount tag */}
        <div className="hidden items-center gap-1.5 rounded-full bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-400 sm:flex">
          <span className="hidden md:inline">Economize R$ 75 no</span> Pix
        </div>

        {/* Publish */}
        <button
          type="button"
          onClick={handlePublish}
          disabled={checkoutLoading}
          className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: '#b54e00' }}
        >
          {checkoutLoading
            ? <><Loader2 size={14} className="animate-spin" /> Aguarde...</>
            : 'Publicar Site — R$ 300 →'}
        </button>
      </div>

      {/* Error */}
      {checkoutError && (
        <div className="shrink-0 bg-red-900/30 px-6 py-2 text-center text-sm text-red-300">
          {checkoutError}
        </div>
      )}

      {/* Payment redirect overlay */}
      {checkoutLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="mx-auto max-w-sm rounded-3xl bg-[#1a1d27] p-8 text-center shadow-2xl ring-1 ring-white/10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
              <Sparkles size={28} className="text-on-primary" />
            </div>
            <h2 className="text-lg font-bold text-white">Preparando seu pagamento</h2>
            <p className="mt-2 text-sm text-white/60">
              Você será redirecionado para o Mercado Pago em instantes.
            </p>
            <div className="mt-6 space-y-3 rounded-2xl bg-white/5 p-4 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Site</span>
                <span className="font-semibold text-white">{businessName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Valor</span>
                <span className="font-semibold text-white">R$ 300</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Pagamento</span>
                <span className="font-semibold text-white">Pix ou Cartão</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
            <p className="mt-4 text-xs text-white/40">
              Pagamento processado pelo Mercado Pago 🔒
            </p>
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
              key={`${briefingId}-${viewport}`}
              src={`/api/preview-draft/${briefingId}`}
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

        {/* Viewport badge */}
        {viewport === 'mobile' && (
          <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
            Mobile · 390px
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizEtapa4() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0f1117] text-white/50">
        <Loader2 size={24} className="animate-spin" />
      </div>
    }>
      <PreviewSandboxInner />
    </Suspense>
  );
}
