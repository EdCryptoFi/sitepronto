'use client';

import { useEffect, type ChangeEvent, type DragEvent } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2, UploadCloud, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { useQuiz } from '@/lib/quiz-context';
import { palettes, quizModules } from '@/lib/quiz-data';
import { TemplateSelector } from '@/components/quiz/TemplateSelector';

export default function QuizEtapa2() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const { objective, logoName, logoPreview, palette, template, selectedModules } = state;

  useEffect(() => {
    if (!objective) router.replace('/quiz');
  }, [objective, router]);

  const canAdvance = selectedModules.length > 0 && Boolean(palette) && Boolean(template);

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () =>
      dispatch({ type: 'SET_LOGO', payload: { name: file.name, preview: String(reader.result ?? '') } });
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLogoFile(file);
    e.target.value = '';
  };

  const handleLogoDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoFile(file);
  };

  return (
    <main className="relative min-h-screen pb-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-50"
        style={{ background: 'radial-gradient(60% 100% at 50% 0%, rgba(0, 74, 198, 0.10), transparent 70%)' }}
      />

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 pt-6">
        <a href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-on-primary">
            <Sparkles size={16} />
          </span>
          <span className="text-title-lg font-bold tracking-tight">
            SitePronto<span className="text-primary">.</span>
          </span>
        </a>
        <div className="flex items-center gap-3">
          <span className="text-label-sm text-on-surface-variant">Etapa 2 de 4</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Progress */}
      <div className="relative mx-auto mt-4 max-w-2xl px-6">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '50%' }} role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
        </div>
      </div>

      <section className="relative mx-auto mt-10 max-w-2xl px-6">
        <h1 className="text-headline-md font-extrabold tracking-[-0.02em]">
          Personalize sua experiência
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Defina a identidade visual e funcional do seu novo site em segundos.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Left column: Logo + Palettes */}
          <div className="space-y-10">
            {/* Logo Upload */}
            <div>
              <p className="mb-3 text-label-md font-semibold">Logo do negócio</p>
              <label
                htmlFor="logo-upload"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleLogoDrop}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition hover:bg-surface-low"
                style={{ borderColor: 'var(--outline-variant)' }}
              >
                {logoPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoPreview} alt="Logo" className="h-20 max-w-[160px] object-contain" />
                    <p className="text-label-sm font-semibold">{logoName}</p>
                    <p className="text-label-sm text-on-surface-variant">Clique para trocar</p>
                  </div>
                ) : (
                  <>
                    <span className="icon-halo mb-3"><UploadCloud size={20} /></span>
                    <p className="text-label-md font-semibold">Arraste seu logo aqui ou clique</p>
                    <p className="mt-1 text-label-sm text-on-surface-variant">PNG, SVG ou JPG (máx 5MB)</p>
                  </>
                )}
                <input id="logo-upload" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoChange} className="sr-only" />
              </label>
              {logoPreview && (
                <button type="button" onClick={() => dispatch({ type: 'SET_LOGO', payload: { name: '', preview: '' } })} className="btn-ghost mt-2 text-sm">
                  <X size={14} /> Remover logo
                </button>
              )}
            </div>

            {/* Color Palettes */}
            <div>
              <p className="mb-3 text-label-md font-semibold">Paleta de cores</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {palettes.map((item) => {
                  const active = palette === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => dispatch({ type: 'SET_PALETTE', payload: item.id })}
                      className={`relative flex flex-col items-start gap-2 rounded-2xl p-3 text-left transition-all ${
                        active ? 'ring-2 ring-primary' : 'hover:bg-surface-low'
                      }`}
                      style={{ backgroundColor: 'var(--surface-container-low)' }}
                    >
                      {active && (
                        <span className="absolute right-2 top-2">
                          <CheckCircle2 size={14} className="text-primary" />
                        </span>
                      )}
                      <div className="flex gap-1.5">
                        {item.colors.map((color) => (
                          <span key={color} className="h-6 w-6 rounded-lg" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                      <div>
                        <p className="text-label-sm font-bold">{item.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{item.helper}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: Modules */}
          <div className="space-y-10">
            {/* Modules */}
            <div>
              <p className="mb-3 text-label-md font-semibold">Módulos do site</p>
              <div className="space-y-2">
                {quizModules.map((mod) => {
                  const active = selectedModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => dispatch({ type: 'TOGGLE_MODULE', payload: mod.id })}
                      className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all ${
                        active ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-surface-low'
                      }`}
                      style={{ backgroundColor: active ? undefined : 'var(--surface-container-low)' }}
                    >
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                        active ? 'border-primary bg-primary' : 'border-on-surface-variant/30'
                      }`}>
                        {active && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-label-md font-semibold">{mod.name}</p>
                        <p className="text-label-sm text-on-surface-variant">{mod.helper}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-label-sm text-on-surface-variant">
                Selecione pelo menos um módulo.
              </p>
            </div>
          </div>
        </div>

        {/* Template selector — full width */}
        <div className="mt-10">
          <p className="mb-4 text-label-md font-semibold">Template do site</p>
          <TemplateSelector />
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed inset-x-0 bottom-4 z-30 px-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-3xl glass-panel px-4 py-3">
          <button type="button" onClick={() => router.push('/quiz')} className="btn-ghost">
            <ArrowLeft size={16} /> Voltar
          </button>
          <div className="flex-1">
            <div className="text-label-sm font-semibold">
              {!selectedModules.length
                ? 'Selecione ao menos 1 módulo'
                : !template
                ? 'Escolha um template'
                : 'Visual configurado'}
            </div>
            <div className="text-[11px] text-on-surface-variant">
              {canAdvance ? 'Agora os detalhes do negócio' : 'Módulo e template são obrigatórios'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => canAdvance && router.push('/quiz/etapa-3')}
            disabled={!canAdvance}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar para Etapa 3 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}
