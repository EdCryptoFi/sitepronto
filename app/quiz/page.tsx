'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2, Phone, Mail, ShieldCheck, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { detectIndustry } from '@/lib/industry';
import { INDUSTRY_TO_PALETTE } from '@/lib/quiz-data';
import { analytics } from '@/lib/analytics';
import ThemeToggle from '@/components/ThemeToggle';

const INDUSTRY_OBJECTIVE: Record<string, string> = {
  restaurante: 'vender-produtos',
  loja: 'vender-produtos',
  clinica: 'servicos',
  beleza: 'servicos',
  mecanica: 'servicos',
  advocacia: 'servicos',
  educacao: 'servicos',
  construcao: 'servicos',
  farmacia: 'servicos',
  veterinaria: 'servicos',
  petshop: 'vender-produtos',
  academia: 'servicos',
  imobiliaria: 'servicos',
  contabilidade: 'servicos',
  tecnologia: 'portfolio',
  turismo: 'servicos',
  transporte: 'servicos',
  fotografia: 'portfolio',
  generico: 'servicos',
};

export default function QuizStep1() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const { businessName, description, email, whatsappNumber, termsAccepted } = state;

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => { analytics.quizStart(); }, []);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canAdvance = businessName.trim().length >= 2 && emailValid && termsAccepted;

  const handleGenerate = async () => {
    if (!canAdvance || loading) return;
    setLoading(true);
    setLoadingStep('Preparando...');
    setLoadingProgress(5);
    setError('');
    analytics.quizSubmit(businessName.trim());

    try {
      // Auto-detect industry from name + description
      const industry = detectIndustry(businessName, description);

      // Auto-fill objective from industry
      const objective = INDUSTRY_OBJECTIVE[industry.id] ?? 'servicos';
      dispatch({ type: 'SET_OBJECTIVE', payload: objective });

      // Auto-fill template from industry
      const template = industry.template;
      dispatch({ type: 'SET_TEMPLATE', payload: template });

      // Auto-fill palette from industry
      const palette = INDUSTRY_TO_PALETTE[industry.id] ?? 'azul-editorial';
      dispatch({ type: 'SET_PALETTE', payload: palette });

      // Build modules array
      const allModules = ['servicos', 'sobre', 'contato', 'depoimentos', 'faq'];
      if (['restaurant', 'portfolio'].includes(template)) {
        allModules.push('galeria');
      }

      const payload = JSON.stringify({
        businessName: businessName.trim(),
        objective,
        logoName: state.logoName,
        logoPreview: state.logoPreview,
        palette,
        template,
        selectedModules: allModules,
        description: description.trim(),
        domain: '',
        domainChoice: 'later',
        portfolioItems: [],
        businessHours: '',
        whatsappNumber: whatsappNumber,
        email: email.trim(),
        referralCode: typeof window !== 'undefined' ? localStorage.getItem('sitepronto-ref') ?? undefined : undefined,
      });

      // Use SSE for real-time progress
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError((errData as { error?: string }).error ?? 'Erro ao gerar o site. Tente novamente.');
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        // Fallback: response not streamable, try parsing JSON
        setError('Erro de conexao. Tente novamente.');
        setLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.message) setLoadingStep(event.message);
            if (event.progress) setLoadingProgress(event.progress);

            if (event.step === 'done' && event.briefingId) {
              dispatch({ type: 'SET_BRIEFING_ID', payload: event.briefingId });
              router.push(`/quiz/preview?id=${event.briefingId}`);
              return;
            }

            if (event.step === 'error') {
              setError(event.message ?? 'Erro ao gerar o site.');
              setLoading(false);
              return;
            }
          } catch { /* ignore parse errors */ }
        }
      }

      // If we get here without a 'done' event, something went wrong
      setError('Geracao incompleta. Tente novamente.');
      setLoading(false);
    } catch {
      setError('Falha de conexao. Verifique sua internet e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-40">
      {/* Background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-50"
        style={{ background: 'radial-gradient(60% 100% at 50% 0%, rgba(0, 74, 198, 0.12), transparent 70%)' }}
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
          <span className="text-label-sm text-on-surface-variant">Etapa 1 de 2</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative mx-auto mt-4 max-w-xl px-6">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '50%' }} role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
        </div>
        <div className="mt-2 flex justify-center gap-2">
          {[1, 2].map((s) => (
            <span key={s} className={`inline-flex h-2 w-2 rounded-full transition-colors ${s === 1 ? 'bg-primary' : 'bg-on-surface/10'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="relative mx-auto mt-10 max-w-xl px-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <Wand2 size={20} className="text-primary" />
          </span>
          <div>
            <h1 className="text-headline-lg font-extrabold tracking-[-0.02em]">
              Seu site em 60 segundos
            </h1>
            <p className="text-body-md text-on-surface-variant">
              A IA cria tudo — textos, imagens, layout. Você só confere.
            </p>
          </div>
        </div>

        {/* Business name */}
        <div className="mt-8">
          <label htmlFor="business-name" className="mb-2 block text-label-md font-semibold">
            Nome do seu Negócio <span className="text-primary">*</span>
          </label>
          <input
            id="business-name"
            type="text"
            value={businessName}
            onChange={(e) => dispatch({ type: 'SET_BUSINESS_NAME', payload: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && (document.getElementById('description') as HTMLElement)?.focus()}
            maxLength={80}
            placeholder="Ex: Clínica Vida, Pizzaria do Mario, Studio Aurora..."
            className="w-full rounded-2xl border-2 bg-surface px-5 py-4 text-body-lg outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            style={{ borderColor: businessName.trim().length >= 2 ? 'var(--primary)' : 'var(--outline-variant)' }}
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="mt-6">
          <label htmlFor="description" className="mb-2 block text-label-md font-semibold">
            Descreva seu negócio <span className="text-label-sm font-normal text-on-surface-variant">(opcional, mas melhora o resultado)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
            className="w-full rounded-2xl border-2 bg-surface px-5 py-4 text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
            style={{ borderColor: description.trim().length > 10 ? 'var(--primary)' : 'var(--outline-variant)' }}
            placeholder="Ex: Oficina mecânica especializada em troca de óleo, alinhamento e balanceamento. Atendemos na zona sul de SP há 15 anos."
            rows={3}
            maxLength={2000}
          />
          <p className="mt-1 text-label-sm text-on-surface-variant">
            Quanto mais detalhes, melhor a IA gera os textos e imagens do site.
          </p>
        </div>

        {/* Email + WhatsApp side by side */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-2 flex items-center gap-1.5 text-label-md font-semibold">
              <Mail size={14} className="text-on-surface-variant" /> E-mail <span className="text-primary">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
              className="w-full rounded-2xl border-2 bg-surface px-4 py-3 text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              style={{ borderColor: emailValid ? 'var(--primary)' : 'var(--outline-variant)' }}
              placeholder="voce@exemplo.com.br"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="mb-2 flex items-center gap-1.5 text-label-md font-semibold">
              <Phone size={14} className="text-on-surface-variant" /> WhatsApp <span className="text-label-sm font-normal text-on-surface-variant">(opcional)</span>
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={whatsappNumber}
              onChange={(e) => dispatch({ type: 'SET_WHATSAPP_NUMBER', payload: e.target.value.replace(/\D/g, '').slice(0, 11) })}
              className="w-full rounded-2xl border-2 bg-surface px-4 py-3 text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              style={{ borderColor: 'var(--outline-variant)' }}
              placeholder="(11) 99999-9999"
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Terms */}
        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl p-4 transition-colors hover:bg-surface-low"
          style={{ backgroundColor: 'var(--surface-container-low)' }}>
          <div className="relative mt-0.5 shrink-0">
            <input type="checkbox" checked={termsAccepted}
              onChange={(e) => dispatch({ type: 'SET_TERMS_ACCEPTED', payload: e.target.checked })} className="sr-only" />
            <div className="flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors"
              style={{ borderColor: termsAccepted ? 'var(--primary)' : 'var(--outline)', backgroundColor: termsAccepted ? 'var(--primary)' : 'transparent' }}>
              {termsAccepted && <ShieldCheck size={12} className="text-on-primary" />}
            </div>
          </div>
          <span className="text-label-md text-on-surface-variant">
            Li e aceito os{' '}
            <a href="/termos" target="_blank" className="text-primary underline underline-offset-2">Termos de Uso</a>{' '}
            e a{' '}
            <a href="/privacidade" target="_blank" className="text-primary underline underline-offset-2">Política de Privacidade</a>.
          </span>
        </label>

        {error && (
          <div className="mt-4 rounded-2xl px-5 py-4 text-body-md font-semibold"
            style={{ backgroundColor: 'rgba(190,18,60,0.08)', color: 'var(--error, #be123c)' }}>
            {error}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-primary" /> IA gera tudo automaticamente
          </span>
          <span className="hidden sm:inline text-on-surface/20">|</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-primary" /> Preview grátis antes de pagar
          </span>
          <span className="hidden sm:inline text-on-surface/20">|</span>
          <span className="flex items-center gap-1.5">
            🇧🇷 Feito para negócios brasileiros
          </span>
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed inset-x-0 bottom-4 z-30 px-4">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-3xl glass-panel px-4 py-3">
          <div className="flex-1">
            <div className="text-label-sm font-semibold">
              {!businessName.trim() ? 'Informe o nome do negócio' : !emailValid ? 'Informe um e-mail válido' : !termsAccepted ? 'Aceite os termos' : `Pronto, ${businessName.split(' ')[0]}!`}
            </div>
            <div className="text-[11px] text-on-surface-variant">
              {canAdvance ? 'A IA vai criar seu site completo em segundos' : 'Preencha os campos obrigatórios'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canAdvance || loading}
            className="btn-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Gerando site...</>
              : <>Gerar Meu Site <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>

      {/* Loading overlay with real-time SSE progress */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-auto max-w-sm rounded-3xl bg-surface p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
              <Sparkles size={28} className="text-on-primary animate-pulse" />
            </div>
            <h2 className="text-title-lg font-bold">Criando seu site...</h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              {loadingStep || 'Preparando...'}
            </p>

            {/* Progress bar */}
            <div className="mt-6 mx-auto max-w-xs">
              <div className="h-2 rounded-full bg-on-surface/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-primary transition-all duration-700 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="mt-2 text-label-sm text-on-surface-variant/60">{loadingProgress}%</p>
            </div>

            <p className="mt-4 text-label-sm text-on-surface-variant/40">
              Criando site para <strong className="text-on-surface-variant">{businessName}</strong>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
