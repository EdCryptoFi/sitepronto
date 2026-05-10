'use client';

import { useState } from 'react';
import { ArrowRight, Sparkles, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RevendaPage() {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/revenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl glass-panel px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-on-primary">
              <Sparkles size={16} />
            </span>
            <span className="text-title-lg font-bold tracking-tight">
              SitePronto<span className="text-primary">.</span>
            </span>
          </Link>
          <Link href="/" className="btn-ghost text-sm">← Voltar ao site</Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-16 md:grid-cols-[1.2fr_1fr] md:items-start">
          {/* Left — info */}
          <div>
            <span className="eyebrow mb-6">
              <Share2 size={12} /> Programa de Revenda
            </span>
            <h1 className="text-headline-lg font-extrabold tracking-[-0.02em]">
              Ganhe{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">R$ 50</span>{' '}
              por cada indicação que virar venda.
            </h1>
            <p className="mt-6 text-body-lg text-on-surface-variant">
              Você se cadastra uma vez, recebe um link exclusivo e começa a indicar. A cada venda confirmada, R$ 50 cai direto no seu Pix — sem limite de indicações.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                'Investimento único de R$ 30 para ativar seu link',
                'R$ 50 de comissão por cada venda confirmada',
                'Painel para acompanhar suas indicações em tempo real',
                'Pagamento automático via Pix a cada venda',
                'Sem limite de indicações — quanto mais, melhor',
                'Materiais de divulgação prontos para usar',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-md">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Math example */}
            <div
              className="mt-10 rounded-2xl p-6"
              style={{ backgroundColor: 'var(--surface-container-low)' }}
            >
              <p className="text-label-sm font-semibold uppercase text-on-surface-variant">Exemplo de ganho</p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-display-sm font-extrabold">5</p>
                  <p className="text-label-sm text-on-surface-variant">vendas/mês</p>
                </div>
                <div>
                  <p className="text-display-sm font-extrabold text-primary">R$ 250</p>
                  <p className="text-label-sm text-on-surface-variant">ganho mensal</p>
                </div>
                <div>
                  <p className="text-display-sm font-extrabold">R$ 3k</p>
                  <p className="text-label-sm text-on-surface-variant">por ano</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-label-md text-on-surface-variant">
              <ShieldCheck size={16} className="text-primary" />
              Pagamento via Pix em até 3 dias úteis após cada venda confirmada.
            </div>
          </div>

          {/* Right — form */}
          <div>
            {status === 'success' ? (
              <div className="card text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <CheckCircle2 size={32} className="text-primary" />
                </div>
                <h2 className="text-headline-sm font-bold">Cadastro recebido!</h2>
                <p className="mt-3 text-body-md text-on-surface-variant">
                  Entraremos em contato pelo WhatsApp em até 24h com seu link exclusivo e as instruções de pagamento.
                </p>
                <Link href="/" className="btn-primary mt-8 w-full">
                  Voltar ao início <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card space-y-5">
                <div>
                  <p className="text-label-sm font-semibold uppercase text-on-surface-variant">Ativar por R$ 30</p>
                  <h2 className="mt-2 text-title-xl font-bold">Cadastre-se agora</h2>
                  <p className="mt-1 text-body-md text-on-surface-variant">
                    Preencha abaixo e entraremos em contato pelo WhatsApp para confirmar o pagamento e enviar seu link.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-label-md font-semibold">
                      Seu nome completo
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      maxLength={120}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-xl border border-[color:var(--outline-variant)] bg-surface px-4 py-3 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Ana Paula Souza"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-label-md font-semibold">
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      maxLength={254}
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-xl border border-[color:var(--outline-variant)] bg-surface px-4 py-3 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="ana@exemplo.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="mb-1.5 block text-label-md font-semibold">
                      WhatsApp (com DDD)
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      required
                      maxLength={20}
                      value={form.whatsapp}
                      onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                      className="w-full rounded-xl border border-[color:var(--outline-variant)] bg-surface px-4 py-3 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-label-md text-red-700">
                    Algo deu errado. Tente novamente em instantes.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {status === 'loading' ? 'Enviando…' : 'Quero ser revendedor'}
                  {status !== 'loading' && <ArrowRight size={16} />}
                </button>

                <p className="text-center text-label-sm text-on-surface-variant">
                  O pagamento de R$ 30 é feito pelo WhatsApp após o cadastro.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
