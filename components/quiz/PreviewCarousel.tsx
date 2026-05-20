'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Monitor, Smartphone, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';

type Variation = {
  id: string;
  name: string;
  label: string;
  html: string;
};

type Viewport = 'desktop' | 'mobile';

export function PreviewCarousel({ onClose }: { onClose: () => void }) {
  const { state } = useQuiz();
  const [variations, setVariations] = useState<Variation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const blobUrls = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch('/api/preview-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: state.businessName,
            template: state.template,
            palette: state.palette,
            selectedModules: state.selectedModules,
            domain: state.domain,
            domainChoice: state.domainChoice,
            whatsappNumber: state.whatsappNumber,
            businessHours: state.businessHours,
            catalogProducts: state.catalogProducts,
            logoName: state.logoName,
            contentNotes: state.contentNotes,
            description: state.description,
            segment: '',
            goal: 'whatsapp',
          }),
        });

        if (!res.ok) {
          if (!cancelled) { setError('Erro ao gerar preview'); setLoading(false); }
          return;
        }

        // Response is JSON with 3 variations
        const data = await res.json();
        if (!data.variations || !cancelled) {
          // Create blob URLs for each variation's HTML
          const urls = data.variations.map((v: Variation) => {
            const blob = new Blob([v.html], { type: 'text/html' });
            return URL.createObjectURL(blob);
          });
          if (!cancelled) {
            blobUrls.current = urls;
            setVariations(data.variations.map((v: Variation, i: number) => ({ ...v, html: urls[i] })));
            setLoading(false);
          }
        }
      } catch {
        if (!cancelled) { setError('Falha ao conectar'); setLoading(false); }
      }
    })();

    return () => { cancelled = true; };
  }, [
    state.businessName, state.template, state.palette,
    state.selectedModules, state.description, state.whatsappNumber,
    state.businessHours, state.domain, state.contentNotes,
  ]);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      blobUrls.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const active = variations[activeIndex];
  const { state: quizState, dispatch } = useQuiz();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-[#1a1d27] shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">Preview ao vivo</span>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/50 capitalize">
              {state.template || 'template'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/6 p-0.5">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  viewport === 'desktop' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Monitor size={13} /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  viewport === 'mobile' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Smartphone size={13} /> Mobile
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-1 items-center justify-center py-24">
            <div className="flex items-center gap-3 text-white/50">
              <Loader2 size={20} className="animate-spin" />
              Gerando 3 variações...
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-1 items-center justify-center py-24">
            <div className="rounded-xl bg-red-900/30 px-6 py-4 text-sm text-red-300">{error}</div>
          </div>
        )}

        {/* Variation tabs + carousel */}
        {!loading && !error && variations.length > 0 && (
          <>
            {/* Variation selector tabs */}
            <div className="flex items-center gap-2 border-b border-white/5 px-6 py-2.5">
              {variations.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                    i === activeIndex
                      ? 'bg-white/15 text-white ring-1 ring-white/20'
                      : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                  }`}
                >
                  {i === activeIndex ? <Check size={12} /> : <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/20 text-[9px]">{i + 1}</span>}
                  {v.name}
                  <span className="ml-1 opacity-50">{v.label}</span>
                </button>
              ))}
            </div>

            {/* Preview frame */}
            <div className="relative flex flex-1 items-start justify-center overflow-auto bg-[#0f1117] p-4">
              {/* Nav arrows */}
              {variations.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
                    className={`absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-xl bg-black/60 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white ${
                      activeIndex === 0 ? 'opacity-30 pointer-events-none' : ''
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i => Math.min(variations.length - 1, i + 1))}
                    className={`absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-xl bg-black/60 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white ${
                      activeIndex === variations.length - 1 ? 'opacity-30 pointer-events-none' : ''
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <div
                className="overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10 transition-all"
                style={{
                  width: viewport === 'mobile' ? '390px' : '100%',
                  maxWidth: '100%',
                  minHeight: '500px',
                }}
              >
                <iframe
                  key={`${activeIndex}-${viewport}`}
                  src={active.html}
                  className="h-full w-full border-0 bg-white"
                  style={{ minHeight: '500px' }}
                  title={`Variação ${active.name}`}
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>

            {/* Variation info bar */}
            <div className="flex items-center justify-between border-t border-white/5 px-6 py-2.5">
              <span className="text-xs text-white/40">
                Variação {activeIndex + 1} de {variations.length} — {active.label}
              </span>
              <button
                type="button"
                onClick={() => {
                  // Keep this variation selected
                  // (the content is already in the editor/briefing)
                  onClose();
                }}
                className="rounded-xl bg-primary/20 px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/30"
              >
                Manter esta variação
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
