'use client';

import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  LayoutTemplate,
  Rocket,
  Share2,
  Smartphone,
  Clock,
  Star,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ============================================================
          HEADER
         ============================================================ */}
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl glass-panel px-5 py-3">
          <a href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-on-primary">
              <Sparkles size={16} />
            </span>
            <span className="text-title-lg font-bold tracking-tight">
              SitePronto<span className="text-primary">.</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-label-md text-on-surface-variant md:flex">
            <a href="#como-funciona" className="hover:text-on-surface transition-colors">
              Como funciona
            </a>
            <a href="#precos" className="hover:text-on-surface transition-colors">
              Preços
            </a>
            <a href="#revenda" className="hover:text-on-surface transition-colors">
              Revenda
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="/quiz" className="btn-primary !py-2.5 !px-5 text-sm">
              Criar meu site
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO
         ============================================================ */}
      <section className="relative overflow-hidden pb-24 pt-16 md:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(0, 74, 198, 0.18), transparent)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-40 h-[400px] w-[400px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(181, 78, 0, 0.14), transparent)' }}
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl pl-0 md:pl-4">
              <span className="eyebrow mb-6">
                <Sparkles size={12} /> Mais de 300 sites publicados
              </span>

              <h1 className="text-5xl font-extrabold tracking-[-0.02em] text-on-surface md:text-display-md">
                Seu site pronto hoje.{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Sem mensalidade.
                </span>{' '}
                Sem complicação.
              </h1>

              <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">
                Responda 3 perguntas e a gente monta a estrutura ideal do seu site — do layout ao{' '}
                <span className="font-semibold text-on-surface">cadeado de segurança</span>,{' '}
                publicado em até 24h.
              </p>

              <div className="mt-10 flex flex-col items-start gap-3">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <a href="/quiz" className="btn-primary text-base">
                    Criar meu site agora <ArrowRight size={18} />
                  </a>
                  <a href="#precos" className="text-label-md font-semibold text-on-surface hover:text-primary transition-colors">
                    Ver preços ↓
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-label-md text-on-surface-variant">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-primary" />
                    Garantia de 7 dias
                  </span>
                  <span className="text-outline-variant">·</span>
                  <span className="font-semibold text-on-surface">R$ 300 único</span>
                  <span className="text-outline-variant">·</span>
                  <span>Sem mensalidade</span>
                </div>
              </div>

              <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-label-md text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <Lock size={16} className="text-primary" /> HTTPS incluso
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" /> Publicado em até 24h
                </li>
                <li className="flex items-center gap-2">
                  <Smartphone size={16} className="text-primary" /> Funciona no celular
                </li>
              </ul>
            </div>

            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ============================================================
          SOCIAL PROOF — depoimentos
         ============================================================ */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="eyebrow mb-4">O que nossos clientes dizem</span>
            <h2 className="text-headline-md font-bold tracking-[-0.015em]">
              Negócios reais. Resultados reais.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <TestimonialCard
              name="Ana Paula Souza"
              role="Restaurante da Ana — São Paulo, SP"
              body="Em menos de 24h tinha o site no ar com cardápio, link do WhatsApp e tudo. Meus clientes já estão pedindo pelo site. Não tem mensalidade e funcionou do primeiro dia."
              stars={5}
            />
            <TestimonialCard
              name="Dr. Carlos Mendes"
              role="Clínica PM — Belo Horizonte, MG"
              body="Precisava de algo profissional, mas sem pagar caro todo mês. O SitePronto entregou exatamente isso: site bonito, seguro, funcionando no celular. Recomendo sem hesitar."
              stars={5}
            />
            <TestimonialCard
              name="Fernanda Costa"
              role="Moda Express — Recife, PE"
              body="Achei que ia ser complicado, mas foram literalmente 3 perguntas. Escolhi o template, paguei e no dia seguinte minha loja já estava online. Simples assim."
              stars={5}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
         ============================================================ */}
      <section id="como-funciona" className="section-tint rounded-t-[48px] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 max-w-2xl">
            <span className="eyebrow mb-4">Três passos</span>
            <h2 className="text-headline-lg font-bold tracking-[-0.015em]">
              Do zero ao{' '}
              <em className="not-italic text-primary">Publicar</em>{' '}
              em poucos minutos.
            </h2>
            <p className="mt-4 text-body-md text-on-surface-variant">
              A gente monta a estrutura ideal do seu site — você só escolhe o visual e confirma.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <StepCard
              index="01"
              icon={<LayoutTemplate size={22} />}
              title="Segmento · Objetivo · Materiais"
              body="Três perguntas objetivas. A estrutura ideal do seu site aparece na hora — sem planilha, sem termo técnico."
            />
            <StepCard
              index="02"
              icon={<Sparkles size={22} />}
              title="Escolha o visual e ajuste"
              body="Selecione cores, template e módulos. Veja o resultado em tempo real antes de pagar qualquer coisa."
            />
            <StepCard
              index="03"
              icon={<Rocket size={22} />}
              title="Publique e apareça no Google"
              body="Pagamento seguro, seu site no ar em até 24h e já otimizado para aparecer nas buscas."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          SITE EXAMPLES
         ============================================================ */}
      <section className="section-tint rounded-b-[48px] px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="eyebrow mb-4">Exemplos reais</span>
            <h2 className="text-headline-md font-bold tracking-[-0.015em]">
              Sites criados com o SitePronto
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-body-md text-on-surface-variant">
              Cada site é montado na hora, com o layout ideal para o segmento do cliente.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <ExampleCard
              label="Restaurante & Estética"
              name="Pizzaria do Mário"
              tag="restaurante"
              color="#7f1d1d"
              desc="Cardápio com fotos, link do WhatsApp e horário de funcionamento."
              domain="pizzariamario.com.br"
              mini={<RestauranteMini />}
            />
            <ExampleCard
              label="Clínica & Saúde"
              name="Clínica Vida"
              tag="clínica"
              color="#0f766e"
              desc="Agendamento, serviços, especialidades e localização no mapa."
              domain="clinicavida.com.br"
              mini={<ClinicaMini />}
            />
            <ExampleCard
              label="Loja & Comércio"
              name="Moda Express"
              tag="loja"
              color="#004ac6"
              desc="Catálogo de produtos, preços, WhatsApp e política de entrega."
              domain="modaexpress.com.br"
              mini={<LojaMini />}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING
         ============================================================ */}
      <section id="precos" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="eyebrow mb-4">Preço único</span>
            <h2 className="text-headline-lg font-bold tracking-[-0.015em]">
              Pague uma vez. Fique tranquilo.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-body-md text-on-surface-variant">
              Sem mensalidade escondida. Sem surpresa no cartão. Seu site é seu — para sempre.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <PriceCard
              badge="À vista"
              price="R$ 300"
              unit="único"
              helper="Pagamento pelo Pix ou cartão"
              cta="Pagar com Pix e publicar hoje"
              features={[
                'Site publicado em até 24h',
                'Hospedagem inclusa por 12 meses',
                'HTTPS (cadeado de segurança)',
                'Funciona no celular e no Google',
                'Suporte prioritário por 30 dias',
                'Garantia de 7 dias ou dinheiro de volta',
              ]}
              savings="Economize R$ 75 no Pix"
              highlighted
            />
            <PriceCard
              badge="Parcelado"
              price="R$ 125"
              unit="× 3"
              helper="Total R$ 375 — no cartão, sem juros"
              cta="Parcelar em 3× sem juros"
              features={[
                'Site publicado em até 24h',
                'Hospedagem inclusa por 12 meses',
                'HTTPS (cadeado de segurança)',
                'Funciona no celular e no Google',
              ]}
            />
          </div>

          {/* Guarantee strip */}
          <div className="mx-auto mt-8 flex max-w-4xl items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 text-body-md">
            <ShieldCheck size={20} className="shrink-0 text-primary" />
            <span>
              <strong>Garantia de 7 dias:</strong> se não ficar satisfeito com o resultado, devolvemos 100% do valor pago. Sem burocracia.
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ
         ============================================================ */}
      <section className="section-tint rounded-[48px] px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="eyebrow mb-4">Perguntas frequentes</span>
            <h2 className="text-headline-md font-bold tracking-[-0.015em]">
              Tudo que você precisa saber
            </h2>
          </div>

          <div className="space-y-3">
            <FaqItem
              question="E se eu não gostar do site?"
              answer="Ao aprovar o layout final, você confirma que está de acordo com a estrutura e diagramação entregue. Ajustes pontuais de texto e imagens são aceitos pelo suporte. Alterações de layout ou diagramação após a aprovação têm custo adicional."
            />
            <FaqItem
              question="Posso alterar o conteúdo depois?"
              answer="Sim. Após a publicação, você pode nos solicitar ajustes de texto e imagens pelo suporte. Alterações de layout ou módulos adicionais podem ter custo extra."
            />
            <FaqItem
              question="O domínio está incluso no preço?"
              answer="Não. O domínio .com.br custa R$ 40/ano e é registrado e pago diretamente por você no Registro.br (ou registrador de sua preferência). Confirmamos a disponibilidade e ajudamos na configuração sem custo adicional."
            />
            <FaqItem
              question="Preciso de hospedagem separada?"
              answer="Não. A hospedagem está inclusa nos R$ 300 por 12 meses a partir da publicação do seu site. Após esse período, a renovação do serviço é de R$ 300/ano — você recebe aviso com 30 dias de antecedência."
            />
            <FaqItem
              question="E se eu já tiver um domínio?"
              answer="Sem problema. No passo 3 do quiz selecione 'Já tenho um domínio', informe o endereço e apontaremos o site para ele sem custo adicional."
            />
            <FaqItem
              question="Em quanto tempo meu site fica no ar?"
              answer="Na maioria dos casos em até 24h após a confirmação do pagamento. Em horário comercial, costumamos publicar em poucas horas."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          AFFILIATE
         ============================================================ */}
      <section
        id="revenda"
        className="relative overflow-hidden px-6 py-24"
        style={{ backgroundColor: 'var(--surface-container-high)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(181, 78, 0, 0.25), transparent)' }}
        />
        <div className="relative mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <span className="eyebrow mb-4" style={{ backgroundColor: 'var(--primary-fixed-dim)' }}>
              <Share2 size={12} /> Programa de Revenda
            </span>
            <h2 className="text-headline-lg font-bold tracking-[-0.015em]">
              Ganhe <span className="text-primary">R$ 50</span> por cada
              indicação que virar venda.
            </h2>
            <p className="mt-4 max-w-md text-body-md text-on-surface-variant">
              Cadastre-se por R$ 30, receba seu link exclusivo e acompanhe as comissões em tempo real. Pagamos via Pix a cada venda confirmada — sem limite de indicações.
            </p>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-label-sm uppercase text-on-surface-variant">Você investe</div>
                <div className="mt-1 text-headline-md">R$ 30</div>
              </div>
              <ArrowRight size={20} className="text-on-surface-variant" />
              <div className="text-right">
                <div className="text-label-sm uppercase text-on-surface-variant">Você recebe</div>
                <div className="mt-1 text-headline-md text-primary">R$ 50 / venda</div>
              </div>
            </div>
            <a href="/revenda" className="btn-accent mt-6 w-full">
              Quero ser revendedor <ArrowRight size={18} />
            </a>
            <p className="mt-3 text-center text-label-sm text-on-surface-variant">
              Sem limite de indicações. Pagamento via Pix.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
         ============================================================ */}
      <footer className="section-tint px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col items-center gap-4 text-center">
            <p className="text-body-lg font-semibold">
              Pronto para ter seu site no ar ainda hoje?
            </p>
            <a href="/quiz" className="btn-primary">
              Quero meu site sem mensalidade <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[color:var(--outline-variant)] pt-8 text-label-md text-on-surface-variant md:flex-row">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-primary text-on-primary">
                <Sparkles size={12} />
              </span>
              © {new Date().getFullYear()} SitePronto
            </div>
            <div className="flex items-center gap-6">
              <a href="/termos" className="hover:text-on-surface transition-colors">Termos</a>
              <a href="/privacidade" className="hover:text-on-surface transition-colors">Privacidade</a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="hover:text-on-surface transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ================================================================
   HERO MOCKUP
   ================================================================ */
function HeroMockup() {
  return (
    <div className="relative isolate mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
      <div
        className="absolute -right-6 -top-6 h-[92%] w-[92%] rounded-3xl"
        style={{ backgroundColor: 'var(--surface-container-low)' }}
        aria-hidden
      />
      <div
        className="relative overflow-hidden rounded-3xl shadow-architectural-lg"
        style={{ backgroundColor: 'var(--surface-container-lowest)' }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-1.5 px-4 py-3"
          style={{ backgroundColor: 'var(--surface-container)' }}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <div
            className="ml-2 flex flex-1 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] text-on-surface-variant"
            style={{ backgroundColor: 'var(--surface-container-lowest)' }}
          >
            <Lock size={9} className="text-green-500" />
            clinicavida.com.br
          </div>
        </div>

        {/* Scaled mini-site preview */}
        <div style={{ position: 'relative', overflow: 'hidden', height: 290 }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 820,
              height: 580,
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
              fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
              background: '#fff',
            }}
          >
            {/* Nav */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18 }}>+</div>
                <span style={{ color: '#0f766e', fontWeight: 800, fontSize: 18 }}>Clínica Vida</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                {['Serviços', 'Equipe', 'Convênios'].map(l => (
                  <span key={l} style={{ color: '#555', fontSize: 14, fontWeight: 500 }}>{l}</span>
                ))}
                <div style={{ background: '#0f766e', color: '#fff', fontSize: 14, fontWeight: 700, padding: '10px 22px', borderRadius: 9 }}>Agendar</div>
              </div>
            </div>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '48px 28px', display: 'flex', alignItems: 'center', gap: 40 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#0f766e', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Saúde & Bem-estar</div>
                <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.1, color: '#111', marginBottom: 12 }}>Sua saúde em<br/>boas mãos</div>
                <div style={{ color: '#555', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>Consultas, exames e tratamentos<br/>com especialistas experientes.</div>
                <div style={{ background: '#0f766e', color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px 32px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  📅 Agendar consulta
                </div>
              </div>
              <div style={{ width: 240, height: 180, borderRadius: 20, background: '#0f766e1a', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
                🏥
              </div>
            </div>
            {/* Services */}
            <div style={{ background: '#fff', padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { emoji: '🩺', name: 'Consultas', desc: 'Clínico geral e especialistas' },
                  { emoji: '🔬', name: 'Exames', desc: 'Lab e imagem no mesmo dia' },
                  { emoji: '💊', name: 'Prescrições', desc: 'Receitas digitais' },
                ].map(s => (
                  <div key={s.name} style={{ background: '#f0fdf4', borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 28 }}>{s.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginTop: 10, color: '#111' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 5 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Published status bar */}
        <div
          className="flex items-center gap-3 border-t px-4 py-3"
          style={{ borderColor: 'var(--outline-variant)' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-label-sm text-on-surface-variant">Site publicado com sucesso</span>
          <span className="ml-auto rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">Online</span>
        </div>
      </div>

      <div className="absolute -bottom-6 left-1/2 flex w-[85%] -translate-x-1/2 items-center gap-2 rounded-3xl glass-panel px-4 py-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-on-primary">
          <Sparkles size={14} />
        </span>
        <div className="flex-1">
          <div className="text-label-sm font-semibold">Pronto para publicar</div>
          <div className="text-[11px] text-on-surface-variant">Seu site está 100% configurado</div>
        </div>
        <button className="btn-accent !px-4 !py-2 text-xs">Publicar</button>
      </div>
    </div>
  );
}

/* ================================================================
   MINI SITE COMPONENTS — mockups realistas para ExampleCard
   ================================================================ */

const MINI_FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";

function MiniSiteWrapper({
  children,
  domain,
  height = 192,
}: {
  children: React.ReactNode;
  domain: string;
  height?: number;
}) {
  // Render at 900px native, scale 0.4 → displayed ~360px wide
  const NATIVE_W = 900;
  const scale = 0.4;
  const NATIVE_H = Math.round(height / scale);
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: NATIVE_W,
          height: NATIVE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          fontFamily: MINI_FONT,
          background: '#fff',
          overflowX: 'hidden',
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            background: '#f0f0f0',
            borderBottom: '1px solid #ddd',
            padding: '13px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#ff5f57', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#febc2e', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#28c840', display: 'inline-block', flexShrink: 0 }} />
          <div
            style={{
              flex: 1,
              background: '#fff',
              borderRadius: 10,
              padding: '5px 14px',
              marginLeft: 10,
              fontSize: 13,
              color: '#888',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ color: '#22c55e', fontSize: 11 }}>🔒</span>
            {domain}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function RestauranteMini() {
  const primary = '#7f1d1d';
  return (
    <>
      {/* Nav */}
      <div style={{ background: primary, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>🍕 Pizzaria do Mário</span>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Cardápio', 'Localização', 'WhatsApp'].map(l => (
            <span key={l} style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, fontWeight: 500 }}>{l}</span>
          ))}
        </div>
      </div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${primary} 0%, #991b1b 100%)`, padding: '36px 28px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,0.18)', display: 'inline-block', borderRadius: 6, padding: '5px 14px', fontSize: 13, color: '#fca5a5', fontWeight: 600, marginBottom: 14 }}>
            ⭐ Aberto agora — delivery 40 min
          </div>
          <div style={{ color: '#fff', fontSize: 32, fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
            As melhores<br/>pizzas da cidade
          </div>
          <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, marginBottom: 22 }}>
            Delivery em até 40 min • São Paulo, SP
          </div>
          <div style={{ background: '#fff', color: primary, fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            📱 Peça pelo WhatsApp
          </div>
        </div>
        <div style={{ width: 200, height: 160, borderRadius: 18, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, flexShrink: 0 }}>
          🍕
        </div>
      </div>
      {/* Menu preview */}
      <div style={{ background: '#fff', padding: '22px 24px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Cardápio</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { emoji: '🍕', name: 'Calabresa', price: 'R$ 45' },
            { emoji: '🧀', name: 'Margherita', price: 'R$ 42' },
            { emoji: '🍗', name: 'Frango c/ catupiry', price: 'R$ 48' },
          ].map(item => (
            <div key={item.name} style={{ border: `1px solid ${primary}22`, borderRadius: 14, padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 32 }}>{item.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>{item.name}</div>
              <div style={{ color: primary, fontWeight: 700, fontSize: 15, marginTop: 5 }}>{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ClinicaMini() {
  const primary = '#0f766e';
  return (
    <>
      {/* Nav */}
      <div style={{ background: '#fff', borderBottom: `2px solid ${primary}20`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 20 }}>+</div>
          <span style={{ color: primary, fontWeight: 800, fontSize: 18 }}>Clínica Vida</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Serviços', 'Equipe', 'Convênios'].map(l => (
            <span key={l} style={{ color: '#555', fontSize: 14, fontWeight: 500 }}>{l}</span>
          ))}
          <div style={{ background: primary, color: '#fff', fontSize: 14, fontWeight: 700, padding: '10px 22px', borderRadius: 9 }}>Agendar</div>
        </div>
      </div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '44px 28px', display: 'flex', alignItems: 'center', gap: 40 }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: primary, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Saúde & Bem-estar</div>
          <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.1, color: '#111', marginBottom: 12 }}>Sua saúde em<br/>boas mãos</div>
          <div style={{ color: '#555', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>Consultas, exames e tratamentos<br/>com especialistas experientes.</div>
          <div style={{ background: primary, color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            📅 Agendar consulta
          </div>
        </div>
        <div style={{ width: 220, height: 160, borderRadius: 20, background: `${primary}18`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
          🏥
        </div>
      </div>
      {/* Services */}
      <div style={{ background: '#fff', padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { emoji: '🩺', name: 'Consultas', desc: 'Clínico geral e especialistas' },
            { emoji: '🔬', name: 'Exames', desc: 'Lab e imagem no mesmo dia' },
            { emoji: '💊', name: 'Prescrições', desc: 'Receitas digitais' },
          ].map(s => (
            <div key={s.name} style={{ background: `${primary}0d`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 28 }}>{s.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10, color: '#111' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function LojaMini() {
  const primary = '#004ac6';
  return (
    <>
      {/* Nav */}
      <div style={{ background: primary, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em' }}>Moda Express</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['Roupas', 'Calçados', 'Promoções'].map(l => (
            <span key={l} style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14 }}>{l}</span>
          ))}
          <span style={{ color: '#fff', fontSize: 20 }}>🛒</span>
        </div>
      </div>
      {/* Hero banner */}
      <div style={{ background: `linear-gradient(135deg, ${primary} 0%, #1d4ed8 100%)`, padding: '32px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ background: '#fbbf24', color: '#000', fontSize: 12, fontWeight: 800, padding: '5px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 14 }}>
            🏷️ ATÉ 50% OFF
          </div>
          <div style={{ color: '#fff', fontSize: 30, fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
            Moda para<br/>todos os estilos
          </div>
          <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, marginBottom: 20 }}>Frete grátis acima de R$ 150</div>
          <div style={{ background: '#fff', color: primary, fontWeight: 700, fontSize: 14, padding: '11px 26px', borderRadius: 9, display: 'inline-block' }}>
            Ver coleção →
          </div>
        </div>
        <div style={{ fontSize: 88, opacity: 0.9, lineHeight: 1 }}>👗</div>
      </div>
      {/* Product grid */}
      <div style={{ background: '#f8fafc', padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { emoji: '👗', name: 'Vestido', price: 'R$ 89', badge: '-30%' },
            { emoji: '👖', name: 'Calça Jeans', price: 'R$ 75', badge: null },
            { emoji: '👟', name: 'Tênis Sport', price: 'R$ 159', badge: '-20%' },
            { emoji: '👜', name: 'Bolsa', price: 'R$ 119', badge: null },
          ].map(p => (
            <div key={p.name} style={{ background: '#fff', borderRadius: 12, padding: 14, position: 'relative', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              {p.badge && (
                <div style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>
                  {p.badge}
                </div>
              )}
              <div style={{ fontSize: 30, textAlign: 'center' }}>{p.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 12, marginTop: 8, color: '#333' }}>{p.name}</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: primary, marginTop: 3 }}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================================================================
   REUSABLE COMPONENTS
   ================================================================ */

function StepCard({
  index, icon, title, body,
}: { index: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <article className="card group">
      <div className="flex items-start justify-between">
        <span className="icon-halo">{icon}</span>
        <span className="text-label-sm font-semibold tracking-wider text-on-surface-variant">{index}</span>
      </div>
      <h3 className="mt-6 text-title-lg font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-body-md text-on-surface-variant">{body}</p>
    </article>
  );
}

function PriceCard({
  badge, price, unit, helper, cta, features, highlighted = false, savings,
}: {
  badge: string; price: string; unit: string; helper: string; cta: string;
  features: string[]; highlighted?: boolean; savings?: string;
}) {
  return (
    <article
      className={`rounded-3xl p-8 transition-shadow duration-200 ease-architect ${
        highlighted ? 'shadow-architectural-lg' : 'shadow-architectural'
      }`}
      style={{
        backgroundColor: highlighted
          ? 'var(--surface-container-lowest)'
          : 'var(--surface-container-low)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">{badge}</span>
        <div className="flex items-center gap-2">
          {savings && (
            <span className="rounded-full bg-green-100 px-3 py-0.5 text-label-sm font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400">{savings}</span>
          )}
          {highlighted && (
            <span className="text-label-sm font-semibold text-primary">Mais escolhido</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-display-md font-extrabold tracking-[-0.02em]">{price}</span>
        <span className="text-body-md text-on-surface-variant">{unit}</span>
      </div>
      <p className="mt-2 text-label-md text-on-surface-variant">{helper}</p>

      <ul className="mt-8 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-body-md">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href={highlighted ? '/quiz?plan=avista' : '/quiz?plan=parcelado'}
        className={highlighted ? 'btn-primary mt-8 w-full' : 'btn-ghost mt-8 w-full'}
      >
        {cta} <ArrowRight size={16} />
      </a>
    </article>
  );
}

function TestimonialCard({
  name, role, body, stars,
}: { name: string; role: string; body: string; stars: number }) {
  return (
    <article className="card flex flex-col gap-4">
      <div className="flex gap-0.5">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} size={14} className="fill-primary text-primary" />
        ))}
      </div>
      <p className="flex-1 text-body-md text-on-surface-variant">"{body}"</p>
      <div>
        <p className="text-label-md font-semibold">{name}</p>
        <p className="text-label-sm text-on-surface-variant">{role}</p>
      </div>
    </article>
  );
}

function ExampleCard({
  label, name, tag, color, desc, domain, mini,
}: {
  label: string;
  name: string;
  tag: string;
  color: string;
  desc: string;
  domain: string;
  mini: React.ReactNode;
}) {
  return (
    <article className="card group overflow-hidden" style={{ padding: 0 }}>
      {/* Real browser mockup — edge-to-edge */}
      <MiniSiteWrapper domain={domain} height={192}>
        {mini}
      </MiniSiteWrapper>

      <div className="p-6">
        <p className="text-label-sm text-on-surface-variant">{label}</p>
        <p className="mt-0.5 text-title-md font-bold">{name}</p>
        <p className="mt-1 text-body-sm text-on-surface-variant">{desc}</p>

        <div className="mt-4 flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-label-sm font-semibold"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {tag}
          </span>
          <a
            href="/quiz"
            className="ml-auto text-label-sm font-semibold text-primary hover:underline"
          >
            Criar site assim →
          </a>
        </div>
      </div>
    </article>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl transition-colors"
      style={{ backgroundColor: 'var(--surface-container-low)' }}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-body-md font-semibold"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {question}
        <ChevronDown
          size={18}
          className={`shrink-0 text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-body-md text-on-surface-variant">
          {answer}
        </div>
      )}
    </div>
  );
}
