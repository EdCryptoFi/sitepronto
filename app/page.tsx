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

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a href="/quiz" className="btn-primary text-base">
                  Criar meu site agora <ArrowRight size={18} />
                </a>
                <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
                  <ShieldCheck size={16} className="text-primary" />
                  Garantia de 7 dias ou dinheiro de volta
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
              name="Pizzaria do Mario"
              tag="restaurante"
              color="#7f1d1d"
              desc="Cardápio com fotos, link do WhatsApp e horário de funcionamento."
            />
            <ExampleCard
              label="Clínica & Saúde"
              name="Clínica Vida"
              tag="clínica"
              color="#0f766e"
              desc="Agendamento, serviços, especialidades e localização no mapa."
            />
            <ExampleCard
              label="Loja & Comércio"
              name="Moda Express"
              tag="loja"
              color="#004ac6"
              desc="Catálogo de produtos, preços, WhatsApp e política de entrega."
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
                'Domínio .com.br incluso',
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
                'Domínio .com.br incluso',
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
              question="O domínio fica comigo?"
              answer="Sim, o domínio .com.br é registrado no seu nome (CPF ou CNPJ). Ele é seu e permanece seu mesmo que você deixe de usar o SitePronto."
            />
            <FaqItem
              question="Preciso de hospedagem separada?"
              answer="Não. A hospedagem está inclusa no valor único de R$ 300. Não há custo mensal de servidor — apenas a renovação anual do domínio (em torno de R$ 40/ano), que fica por sua conta após o primeiro ano."
            />
            <FaqItem
              question="E se eu já tiver um domínio?"
              answer="Sem problema. No passo 3 do quiz você pode informar que já tem um domínio e apontaremos seu site existente para ele, sem custo adicional."
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
        className="relative rounded-3xl p-5 shadow-architectural-lg"
        style={{ backgroundColor: 'var(--surface-container-lowest)' }}
      >
        <div className="flex items-center gap-1.5 pb-4">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--outline-variant)' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--outline-variant)' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--outline-variant)' }} />
          <span className="ml-3 flex items-center gap-1 text-label-sm text-on-surface-variant">
            <Lock size={10} className="text-primary" /> seudominio.com.br
          </span>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--surface-container-low)' }}>
          <div className="text-label-sm uppercase tracking-wide text-primary">Clínica Vida</div>
          <div className="mt-2 text-title-lg font-bold tracking-tight">
            Consultas online em 3 cliques.
          </div>
          <div className="mt-1 text-label-md text-on-surface-variant">
            Agendamento direto pelo WhatsApp.
          </div>
          <button className="btn-primary mt-5 w-full !py-3 text-sm">Agendar consulta</button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {['Sobre', 'Serviços', 'Contato'].map((t) => (
            <div
              key={t}
              className="rounded-xl p-3 text-center text-label-sm"
              style={{ backgroundColor: 'var(--surface-container)' }}
            >
              {t}
            </div>
          ))}
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
  label, name, tag, color, desc,
}: { label: string; name: string; tag: string; color: string; desc: string }) {
  return (
    <article className="card group overflow-hidden">
      {/* Mini site mockup */}
      <div
        className="mb-4 flex h-32 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${color}18` }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-1 h-6 w-24 rounded-md"
            style={{ backgroundColor: `${color}44` }}
          />
          <div
            className="mx-auto h-3 w-16 rounded-md"
            style={{ backgroundColor: `${color}33` }}
          />
          <div
            className="mx-auto mt-3 h-8 w-24 rounded-xl"
            style={{ backgroundColor: color, opacity: 0.9 }}
          />
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-label-sm text-on-surface-variant">{label}</p>
          <p className="mt-0.5 text-title-md font-bold">{name}</p>
          <p className="mt-1 text-body-sm text-on-surface-variant">{desc}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-label-sm font-semibold"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {tag}
        </span>
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
