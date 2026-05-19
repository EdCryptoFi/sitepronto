'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Monitor, Smartphone, Loader2 } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';

type Viewport = 'desktop' | 'mobile';

export function LivePreview({ onClose }: { onClose: () => void }) {
  const { state } = useQuiz();
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

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

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        // Revoke previous URL
        if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = url;

        if (!cancelled) { setPreviewUrl(url); setLoading(false); }
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-[#1a1d27] shadow-2xl ring-1 ring-white/10"
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

        {/* preview area */}
        <div className="flex flex-1 items-start justify-center overflow-auto bg-[#0f1117] p-4">
          {loading && (
            <div className="flex items-center gap-3 py-20 text-white/50">
              <Loader2 size={20} className="animate-spin" />
              Gerando preview...
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-red-900/30 px-6 py-4 text-sm text-red-300">
              {error}
            </div>
          )}
          {previewUrl && !loading && (
            <div
              className="overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10 transition-all"
              style={{
                width: viewport === 'mobile' ? '390px' : '100%',
                maxWidth: '100%',
                minHeight: '500px',
              }}
            >
              <iframe
                key={viewport}
                src={previewUrl}
                className="h-full w-full border-0 bg-white"
                style={{ minHeight: '500px' }}
                title="Preview do site"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}