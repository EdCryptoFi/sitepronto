'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowLeft, Sparkles, Plus, X, Clock, Globe2,
  Mail, ShieldCheck, Loader2, FileText, Image as ImageIcon, Phone,
  Wand2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { useQuiz } from '@/lib/quiz-context';
import type { CoachFeedback } from '@/lib/description-coach';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function QuizEtapa3() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const {
    objective, selectedModules,
    description, domain, domainChoice, portfolioItems,
    businessHours, email, termsAccepted,
  } = state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coach, setCoach] = useState<CoachFeedback | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [showImproved, setShowImproved] = useState(false);
  const coachTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAnalyzed = useRef('');

  useEffect(() => {
    if (!objective) router.replace('/quiz');
    else if (!selectedModules.length) router.replace('/quiz/etapa-2');
  }, [objective, selectedModules, router]);

  const triggerCoach = (text: string) => {
    if (coachTimer.current) clearTimeout(coachTimer.current);
    if (text.trim().length < 15) { setCoach(null); return; }
    coachTimer.current = setTimeout(async () => {
      if (text === lastAnalyzed.current) return;
      lastAnalyzed.current = text;
      setCoachLoading(true);
      try {
        const res = await fetch('/api/coach-description', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, businessName: state.businessName, objective: state.objective }),
        });
        if (res.ok) setCoach(await res.json());
      } catch { /* silencioso */ } finally {
        setCoachLoading(false);
      }
    }, 2500);
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const domainOk = domainChoice === 'later' || domain.trim().length >= 3;
  const canAdvance = emailValid && termsAccepted && domainOk;

  const handlePortfolioImage = (id: string, file: File) => {
    if (!file.type.startsWith('image/') || file.size > 3 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () =>
      dispatch({ type: 'UPDATE_PORTFOLIO_ITEM', payload: { id, field: 'imagePreview', value: String(reader.result ?? '') } });
    reader.readAsDataURL(file);
  };

  const handleSaveDraft = async () => {
    if (!canAdvance || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: state.businessName,
          objective: state.objective,
          logoName: state.logoName,
          logoPreview: state.logoPreview,
          palette: state.palette,
          template: state.template,
          selectedModules: state.selectedModules,
          description: state.description,
          domain: state.domain.trim(),
          domainChoice: state.domainChoice,
          portfolioItems: state.portfolioItems,
          businessHours: state.businessHours,
          whatsappNumber: state.whatsappNumber,
          email: state.email.trim(),
          referralCode: localStorage.getItem('sitepronto-ref') ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Erro ao salvar.'); setLoading(false); return; }
      dispatch({ type: 'SET_BRIEFING_ID', payload: data.briefingId });
      router.push(`/quiz/etapa-4?id=${data.briefingId}`);
    } catch {
      setError('Falha de conexão. Tente novamente.');
      setLoading(false);
    }
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
          <span className="text-label-sm text-on-surface-variant">Etapa 3 de 4</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Progress */}
      <div className="relative mx-auto mt-4 max-w-2xl px-6">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '75%' }} role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} />
        </div>
        <div className="mt-2 flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <span key={s} className={`inline-flex h-2 w-2 rounded-full transition-colors ${s <= 3 ? 'bg-primary' : 'bg-on-surface/10'}`} />
          ))}
        </div>
      </div>

      <section className="relative mx-auto mt-10 max-w-2xl space-y-8 px-6">
        <div>
          <h1 className="text-headline-md font-extrabold tracking-[-0.02em]">
            Personalize sua presença digital
          </h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Configure os detalhes essenciais para que o SitePronto possa arquitetar sua plataforma com precisão.
          </p>
        </div>

        {/* Business description */}
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <span className="icon-halo !h-7 !w-7"><FileText size={14} /></span>
            <span className="text-label-md font-semibold">Sobre o seu negócio</span>
          </div>
          <textarea
            value={description}
            onChange={(e) => {
              dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value });
              triggerCoach(e.target.value);
            }}
            className="field min-h-32 resize-y"
            placeholder="Descreva seu negócio, ramo de atuação, diferenciais... Se já tiver um site ou apresentação, cole o link aqui também."
            maxLength={2000}
          />
          <p className="mt-2 text-label-sm text-on-surface-variant">
            Quanto mais detalhes, melhor o resultado. Este texto aparecerá no seu site.
          </p>

          {/* Description Coach */}
          {coachLoading && (
            <div className="mt-3 flex items-center gap-2 text-label-sm text-on-surface-variant">
              <Loader2 size={13} className="animate-spin" /> Analisando descrição…
            </div>
          )}
          {coach && !coachLoading && (
            <div className="mt-3 rounded-2xl border p-4 space-y-3" style={{
              borderColor: coach.score === 'ótima' ? 'var(--primary)' : coach.score === 'boa' ? '#d97706' : 'var(--error, #be123c)',
              backgroundColor: coach.score === 'ótima' ? 'rgba(0,74,198,0.05)' : coach.score === 'boa' ? 'rgba(217,119,6,0.05)' : 'rgba(190,18,60,0.05)',
            }}>
              {/* Score bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Wand2 size={14} style={{ color: coach.score === 'ótima' ? 'var(--primary)' : coach.score === 'boa' ? '#d97706' : '#be123c' }} />
                  <span className="text-label-sm font-semibold" style={{ color: coach.score === 'ótima' ? 'var(--primary)' : coach.score === 'boa' ? '#d97706' : '#be123c' }}>
                    Descrição {coach.score} — {coach.score_value}/100
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-on-surface/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${coach.score_value}%`,
                    backgroundColor: coach.score === 'ótima' ? 'var(--primary)' : coach.score === 'boa' ? '#d97706' : '#be123c',
                  }}
                />
              </div>

              {/* Tip */}
              <p className="text-label-sm text-on-surface-variant">{coach.tip}</p>

              {/* Missing items */}
              {coach.missing.length > 0 && coach.score !== 'ótima' && (
                <div className="flex flex-wrap gap-1.5">
                  {coach.missing.map((m) => (
                    <span key={m} className="rounded-full bg-on-surface/8 px-2 py-0.5 text-[10px] font-medium text-on-surface-variant">
                      + {m}
                    </span>
                  ))}
                </div>
              )}

              {/* Improved version */}
              {coach.improved && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowImproved((v) => !v)}
                    className="flex items-center gap-1 text-label-sm font-semibold"
                    style={{ color: 'var(--primary)' }}
                  >
                    {showImproved ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    {showImproved ? 'Ocultar sugestão' : 'Ver versão melhorada'}
                  </button>
                  {showImproved && (
                    <div className="mt-2 rounded-xl bg-on-surface/5 p-3">
                      <p className="text-label-sm text-on-surface-variant italic">&ldquo;{coach.improved}&rdquo;</p>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'SET_DESCRIPTION', payload: coach.improved! });
                          setShowImproved(false);
                        }}
                        className="mt-2 text-[11px] font-semibold"
                        style={{ color: 'var(--primary)' }}
                      >
                        Usar esta versão
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Domain */}
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <span className="icon-halo !h-7 !w-7"><Globe2 size={14} /></span>
            <span className="text-label-md font-semibold">Nome do site</span>
          </div>
          <div className="space-y-3">
            {/* Option: want a new .com.br */}
            <label className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all ${domainChoice === 'new' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-surface-low'}`}
              style={{ backgroundColor: domainChoice === 'new' ? undefined : 'var(--surface-container-low)' }}>
              <input type="radio" name="domain-choice" value="new" checked={domainChoice === 'new'}
                onChange={() => dispatch({ type: 'SET_DOMAIN_CHOICE', payload: 'new' })} className="sr-only" />
              <div className={`h-4 w-4 shrink-0 rounded-full border-2 ${domainChoice === 'new' ? 'border-primary bg-primary' : 'border-on-surface-variant/40'}`} />
              <div className="flex-1">
                <p className="text-label-md font-semibold">Quero um endereço .com.br novo</p>
                <p className="text-label-sm text-on-surface-variant">Digite o nome desejado — verificamos a disponibilidade no Registro.br. O domínio é pago separadamente.</p>
              </div>
            </label>

            {domainChoice === 'new' && (
              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2">
                  <input
                    value={domain}
                    onChange={(e) => dispatch({ type: 'SET_DOMAIN', payload: e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase() })}
                    className="field flex-1"
                    placeholder="nomedoseunegocio"
                    maxLength={20}
                  />
                  <span className="shrink-0 rounded-xl bg-surface-med px-3 py-3 text-label-md font-semibold">.com.br</span>
                </div>
                <p className="text-label-xs text-on-surface-variant">
                  ℹ️ O domínio não está incluso no valor do site. O registro .com.br custa aproximadamente <strong>R$ 40/ano</strong> e é pago diretamente no Registro.br (ou registrador de sua preferência). Confirmamos a disponibilidade antes da publicação.
                </p>
              </div>
            )}

            {/* Option: already have a domain */}
            <label className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all ${domainChoice === 'later' && domain.includes('.') ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-surface-low'}`}
              style={{ backgroundColor: (domainChoice === 'later' && domain.includes('.')) ? undefined : 'var(--surface-container-low)' }}>
              <input type="radio" name="domain-choice" value="later" checked={domainChoice === 'later' && domain.includes('.')}
                onChange={() => { dispatch({ type: 'SET_DOMAIN_CHOICE', payload: 'later' }); dispatch({ type: 'SET_DOMAIN', payload: 'existente' }); }} className="sr-only" />
              <div className={`h-4 w-4 shrink-0 rounded-full border-2 ${domainChoice === 'later' && domain.includes('.') ? 'border-primary bg-primary' : 'border-on-surface-variant/40'}`} />
              <div className="flex-1">
                <p className="text-label-md font-semibold">Já tenho um domínio</p>
                <p className="text-label-sm text-on-surface-variant">Informe o endereço atual e apontamos o site para ele sem custo adicional.</p>
              </div>
            </label>

            {domainChoice === 'later' && domain.includes('.') && (
              <div className="flex items-center gap-2 pl-2">
                <input
                  value={domain === 'existente' ? '' : domain}
                  onChange={(e) => dispatch({ type: 'SET_DOMAIN', payload: e.target.value.toLowerCase().trim() || 'existente' })}
                  className="field flex-1"
                  placeholder="meusite.com.br"
                />
              </div>
            )}

            {/* Option: decide later */}
            <label className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all ${domainChoice === 'later' && !domain.includes('.') ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-surface-low'}`}
              style={{ backgroundColor: (domainChoice === 'later' && !domain.includes('.')) ? undefined : 'var(--surface-container-low)' }}>
              <input type="radio" name="domain-choice" value="later" checked={domainChoice === 'later' && !domain.includes('.')}
                onChange={() => { dispatch({ type: 'SET_DOMAIN_CHOICE', payload: 'later' }); dispatch({ type: 'SET_DOMAIN', payload: '' }); }} className="sr-only" />
              <div className={`h-4 w-4 shrink-0 rounded-full border-2 ${domainChoice === 'later' && !domain.includes('.') ? 'border-primary bg-primary' : 'border-on-surface-variant/40'}`} />
              <div className="flex-1">
                <p className="text-label-md font-semibold">Decidir depois</p>
                <p className="text-label-sm text-on-surface-variant">Nossa equipe entra em contato para definir o domínio antes da publicação.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Portfolio items */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="icon-halo !h-7 !w-7"><ImageIcon size={14} /></span>
              <span className="text-label-md font-semibold">Itens de portfólio / menu</span>
            </div>
            <span className="text-label-sm text-on-surface-variant">opcional</span>
          </div>

          <div className="space-y-3">
            {portfolioItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-2xl bg-surface-low p-3">
                <label className="relative shrink-0 cursor-pointer">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-surface-med">
                    {item.imagePreview
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={item.imagePreview} alt="" className="h-full w-full object-cover" />
                      : <ImageIcon size={18} className="text-on-surface-variant opacity-40" />}
                  </div>
                  <input type="file" accept="image/*" className="sr-only"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePortfolioImage(item.id, f); e.target.value = ''; }} />
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                    <Plus size={10} />
                  </span>
                </label>
                <div className="flex-1 space-y-2">
                  <input className="field" placeholder="Título (ex: Projeto Residencial Alpha)"
                    value={item.title}
                    onChange={(e) => dispatch({ type: 'UPDATE_PORTFOLIO_ITEM', payload: { id: item.id, field: 'title', value: e.target.value } })} />
                  <input className="field" placeholder="Categoria (ex: Arquitetura Moderna)"
                    value={item.category}
                    onChange={(e) => dispatch({ type: 'UPDATE_PORTFOLIO_ITEM', payload: { id: item.id, field: 'category', value: e.target.value } })} />
                </div>
                <button type="button" onClick={() => dispatch({ type: 'REMOVE_PORTFOLIO_ITEM', payload: item.id })}
                  className="mt-1 rounded-lg p-1.5 text-on-surface-variant hover:bg-surface hover:text-on-surface">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {portfolioItems.length < 8 && (
            <button type="button" onClick={() => dispatch({ type: 'ADD_PORTFOLIO_ITEM' })}
              className="btn-ghost mt-3 w-full justify-center">
              <Plus size={14} /> Adicionar item
            </button>
          )}
        </div>

        {/* Business hours */}
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <span className="icon-halo !h-7 !w-7"><Clock size={14} /></span>
            <span className="text-label-md font-semibold">Horário de funcionamento</span>
            <span className="ml-auto text-label-sm text-on-surface-variant">opcional</span>
          </div>
          <div className="space-y-2">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-label-sm font-semibold text-on-surface-variant">{day}</span>
                <input
                  className="field flex-1"
                  placeholder={day === 'Domingo' ? 'Fechado' : '09:00 – 18:00'}
                  defaultValue=""
                  onBlur={(e) => {
                    const lines = (businessHours || '').split('\n').filter(Boolean);
                    const filtered = lines.filter((l) => !l.startsWith(day));
                    if (e.target.value.trim()) filtered.push(`${day}: ${e.target.value.trim()}`);
                    dispatch({ type: 'SET_BUSINESS_HOURS', payload: filtered.join('\n') });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <span className="icon-halo !h-7 !w-7"><Mail size={14} /></span>
            <span className="text-label-md font-semibold">Seu e-mail para confirmação</span>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
            className="field"
            placeholder="voce@exemplo.com.br"
            autoComplete="email"
          />
        </div>

        {/* WhatsApp */}
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <span className="icon-halo !h-7 !w-7"><Phone size={14} /></span>
            <span className="text-label-md font-semibold">WhatsApp para contato</span>
            <span className="ml-auto text-label-sm text-on-surface-variant">opcional</span>
          </div>
          <input
            type="tel"
            value={state.whatsappNumber}
            onChange={(e) => dispatch({ type: 'SET_WHATSAPP_NUMBER', payload: e.target.value.replace(/\D/g, '').slice(0, 11) })}
            className="field"
            placeholder="(11) 99999-9999"
            autoComplete="tel"
          />
          <p className="mt-2 text-label-sm text-on-surface-variant">
            Seus clientes poderão falar com você diretamente pelo WhatsApp.
          </p>
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl p-4 transition-colors hover:bg-surface-low"
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
            Concordo com o tratamento dos meus dados conforme a LGPD.
          </span>
        </label>

        {error && (
          <div className="rounded-2xl px-5 py-4 text-body-md font-semibold"
            style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface)' }}>
            {error}
          </div>
        )}
      </section>

      {/* Floating CTA */}
      <div className="fixed inset-x-0 bottom-4 z-30 px-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-3xl glass-panel px-4 py-3">
          <button type="button" onClick={() => router.push('/quiz/etapa-2')} disabled={loading} className="btn-ghost disabled:opacity-50">
            <ArrowLeft size={16} /> Voltar
          </button>
          <div className="flex-1">
            <div className="text-label-sm font-semibold">
              {!emailValid ? 'Informe um e-mail válido' : !termsAccepted ? 'Aceite os termos para continuar' : !domainOk ? 'Informe o domínio ou decida depois' : 'Tudo pronto!'}
            </div>
            <div className="text-[11px] text-on-surface-variant">
              Ver preview do site antes de pagar
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!canAdvance || loading}
            className="btn-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Aguarde...</>
              : <>Ver meu Site e Publicar <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </main>
  );
}
