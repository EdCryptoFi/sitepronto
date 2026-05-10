'use client';

import { Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { objectives, OBJECTIVE_TO_TEMPLATE } from '@/lib/quiz-data';
import ThemeToggle from '@/components/ThemeToggle';

export default function QuizEtapa1() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const { businessName, objective } = state;

  const canAdvance = businessName.trim().length >= 2 && Boolean(objective);

  const handleNext = () => {
    if (!canAdvance) return;
    // Auto-suggest template from objective
    const suggestedTemplate = OBJECTIVE_TO_TEMPLATE[objective as keyof typeof OBJECTIVE_TO_TEMPLATE];
    if (suggestedTemplate && !state.template) {
      dispatch({ type: 'SET_TEMPLATE', payload: suggestedTemplate });
    }
    router.push('/quiz/etapa-2');
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-40">
      {/* Background blur */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px] opacity-50"
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
          <span className="text-label-sm text-on-surface-variant">Etapa 1 de 4</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative mx-auto mt-4 max-w-xl px-6">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '25%' }} role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
        </div>
      </div>

      {/* Content */}
      <section className="relative mx-auto mt-14 max-w-xl px-6">
        <h1 className="text-headline-lg font-extrabold tracking-[-0.02em]">
          Vamos começar a dar vida ao seu negócio.
        </h1>
        <p className="mt-3 text-body-md text-on-surface-variant">
          Em menos de 1 minuto, o SitePronto vai estruturar sua presença online.
        </p>

        {/* Business name */}
        <div className="mt-10">
          <label htmlFor="business-name" className="mb-2 block text-label-md font-semibold">
            Nome do seu Negócio
          </label>
          <input
            id="business-name"
            type="text"
            value={businessName}
            onChange={(e) => dispatch({ type: 'SET_BUSINESS_NAME', payload: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            maxLength={80}
            placeholder="Ex: Clínica Vida, Pizzaria do Mario, Studio Aurora..."
            className="w-full rounded-2xl border-2 bg-surface px-5 py-4 text-body-lg outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            style={{ borderColor: businessName.trim().length >= 2 ? 'var(--primary)' : 'var(--outline-variant)' }}
            autoFocus
          />
        </div>

        {/* Objectives */}
        <div className="mt-10">
          <p className="mb-4 text-label-md font-semibold">Qual é o objetivo principal do seu site?</p>
          <div className="grid grid-cols-2 gap-3">
            {objectives.map((obj) => {
              const Icon = obj.icon;
              const active = objective === obj.id;
              return (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => dispatch({ type: 'SET_OBJECTIVE', payload: obj.id })}
                  className={`flex flex-col items-start gap-3 rounded-2xl p-4 text-left transition-all ${
                    active
                      ? 'bg-primary text-on-primary shadow-architectural-lg'
                      : 'bg-surface-low hover:bg-surface-med text-on-surface'
                  }`}
                >
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                    active ? 'bg-white/20' : 'bg-surface-med'
                  }`}>
                    <Icon size={20} className={active ? 'text-white' : 'text-primary'} />
                  </span>
                  <div>
                    <p className="text-label-md font-bold">{obj.name}</p>
                    <p className={`mt-0.5 text-label-sm ${active ? 'text-white/70' : 'text-on-surface-variant'}`}>
                      {obj.helper}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed inset-x-0 bottom-4 z-30 px-4">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-3xl glass-panel px-4 py-3">
          <div className="flex-1">
            <div className="text-label-sm font-semibold">
              {canAdvance ? `Pronto, ${businessName.split(' ')[0]}!` : 'Preencha os campos acima'}
            </div>
            <div className="text-[11px] text-on-surface-variant">
              {canAdvance ? 'Vamos escolher o visual do site' : 'Nome e objetivo são obrigatórios'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar para Etapa 2 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}
