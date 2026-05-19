'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, X, Eye, Monitor } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';
import { OBJECTIVE_TO_TEMPLATE, type TemplateId, type ObjectiveId } from '@/lib/quiz-data';
import { LivePreview } from '@/components/quiz/LivePreview';

type TemplateMeta = {
  name: string;
  description: string;
  segments: string;
  tag: string;
  colors: { bg: string; hero: string; primary: string; accent: string; text: string; muted: string };
};

const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  restaurant: {
    name: 'Restaurante & Estética',
    description: 'Fundo escuro com cores quentes, catálogo de pratos em destaque, botão WhatsApp e seção de horários.',
    segments: 'Restaurante, Beleza, Gastronomia, Café',
    tag: 'Quente & Envolvente',
    colors: { bg: '#1c1917', hero: '#292524', primary: '#ea580c', accent: '#fbbf24', text: '#fafaf9', muted: '#78716c' },
  },
  farmacy: {
    name: 'Clínica & Saúde',
    description: 'Layout limpo e confiável, seção de especialidades, destaques de promoções e agendamento online.',
    segments: 'Clínica, Farmácia, Saúde, Pet Shop',
    tag: 'Clean & Confiável',
    colors: { bg: '#f0fdf4', hero: '#dcfce7', primary: '#16a34a', accent: '#0284c7', text: '#14532d', muted: '#6b7280' },
  },
  store: {
    name: 'Loja & Comércio',
    description: 'Grid de produtos minimalista, filtros por categoria, carrinho integrado e checkout direto.',
    segments: 'Loja, Comércio, E-commerce',
    tag: 'Minimalista & Moderno',
    colors: { bg: '#ffffff', hero: '#f8fafc', primary: '#111827', accent: '#2563eb', text: '#111827', muted: '#94a3b8' },
  },
  portfolio: {
    name: 'Portfólio & Serviços',
    description: 'Design profissional em dark mode, galeria de casos, seção de serviços e depoimentos de clientes.',
    segments: 'Advocacia, Consultoria, Educação, Serviços',
    tag: 'Profissional & Dark',
    colors: { bg: '#0f172a', hero: '#1e293b', primary: '#f59e0b', accent: '#6366f1', text: '#f8fafc', muted: '#64748b' },
  },
};

const ALL_TEMPLATES: TemplateId[] = ['restaurant', 'farmacy', 'store', 'portfolio'];

type MockupProps = { scale?: number; fill?: boolean };

function RestaurantMockup({ scale, fill }: MockupProps) {
  const c = TEMPLATES.restaurant.colors;
  const s = (v: number) => (scale ?? 1) * v;
  const svgProps = fill
    ? { width: '100%' as const, height: 'auto' as const, viewBox: '0 0 240 340', style: { display: 'block' as const } }
    : { width: s(240), height: s(340), viewBox: '0 0 240 340', style: { display: 'block' as const } };

  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="rg-food1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.9" />
          <stop offset="60%" stopColor={c.primary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c.hero} stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="rg-food2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.hero} stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* bg */}
      <rect width="240" height="340" fill={c.bg} />

      {/* header */}
      <rect width="240" height="26" fill={c.hero} />
      <rect x="10" y="9" width="38" height="8" rx="3" fill={c.accent} opacity="0.9" />
      <rect x="160" y="10" width="22" height="6" rx="3" fill={c.muted} opacity="0.5" />
      <rect x="188" y="10" width="22" height="6" rx="3" fill={c.muted} opacity="0.5" />
      <rect x="216" y="8" width="16" height="10" rx="5" fill={c.primary} opacity="0.8" />

      {/* hero */}
      <rect y="26" width="240" height="96" fill={c.hero} />
      {/* food photo blob */}
      <circle cx="185" cy="66" r="38" fill="url(#rg-food1)" opacity="0.85" />
      <circle cx="178" cy="58" r="22" fill={c.accent} opacity="0.3" />
      <circle cx="192" cy="72" r="14" fill={c.primary} opacity="0.4" />
      {/* rating badge */}
      <rect x="10" y="34" width="56" height="14" rx="7" fill={c.primary} opacity="0.9" />
      <rect x="14" y="38" width="48" height="6" rx="3" fill={c.accent} opacity="0.9" />
      {/* headline */}
      <rect x="10" y="54" width="130" height="12" rx="3" fill={c.text} opacity="0.95" />
      <rect x="10" y="70" width="105" height="10" rx="3" fill={c.text} opacity="0.7" />
      <rect x="10" y="84" width="60" height="18" rx="9" fill={c.primary} />
      <rect x="16" y="89" width="48" height="8" rx="3" fill="white" opacity="0.9" />
      <rect x="76" y="84" width="52" height="18" rx="9" fill="transparent" stroke={c.muted} strokeWidth="1.5" />
      <rect x="82" y="89" width="40" height="8" rx="3" fill={c.muted} opacity="0.6" />

      {/* category tabs */}
      <rect y="122" width="240" height="20" fill={c.bg} />
      {['Pratos', 'Bebidas', 'Sobremesa', 'Combos'].map((_, i) => (
        <g key={i}>
          <rect x={8 + i * 58} y="126" width="50" height="12" rx="6"
            fill={i === 0 ? c.primary : 'transparent'}
            stroke={i === 0 ? 'none' : c.muted} strokeWidth="1" strokeOpacity="0.4" />
          <rect x={12 + i * 58} y="129" width={i === 0 ? 42 : 30} height="6" rx="3"
            fill={i === 0 ? 'white' : c.muted} opacity={i === 0 ? 0.9 : 0.4} />
        </g>
      ))}

      {/* section label */}
      <rect x="10" y="150" width="60" height="7" rx="3" fill={c.primary} opacity="0.8" />
      <rect x="76" y="153" width="90" height="2" rx="1" fill={c.muted} opacity="0.2" />

      {/* food cards row */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${6 + i * 76}, 162)`}>
          <rect width="68" height="90" rx="10" fill={c.hero} />
          {/* food photo placeholder */}
          <rect width="68" height="44" rx="10" fill={c.muted} opacity="0.2" />
          <circle cx="34" cy="22" r="14" fill={i === 1 ? 'url(#rg-food1)' : 'url(#rg-food2)'} opacity="0.75" />
          <circle cx="34" cy="22" r="7" fill={c.accent} opacity="0.5" />
          {/* info */}
          <rect x="6" y="50" width="46" height="6" rx="2" fill={c.text} opacity="0.85" />
          <rect x="6" y="60" width="32" height="5" rx="2" fill={c.muted} opacity="0.5" />
          {/* price + add */}
          <rect x="6" y="70" width="28" height="12" rx="6" fill={c.primary} opacity="0.9" />
          <rect x="8" y="73" width="24" height="6" rx="3" fill={c.accent} opacity="0.9" />
          <rect x="42" y="70" width="20" height="12" rx="6" fill={c.hero} opacity="0.5" stroke={c.muted} strokeWidth="1" strokeOpacity="0.3" />
          <rect x="49" y="74" width="6" height="4" rx="1" fill={c.muted} opacity="0.5" />
        </g>
      ))}

      {/* 3-step section */}
      <rect x="10" y="262" width="80" height="7" rx="3" fill={c.text} opacity="0.7" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${6 + i * 76}, 276)`}>
          <circle cx="34" cy="16" r="16" fill={c.primary} opacity="0.15" />
          <rect x="22" y="12" width="24" height="8" rx="2" fill={c.primary} opacity="0.5" />
          <rect x="8" y="36" width="52" height="5" rx="2" fill={c.text} opacity="0.6" />
          <rect x="14" y="44" width="40" height="4" rx="2" fill={c.muted} opacity="0.35" />
        </g>
      ))}

      {/* footer wa bar */}
      <rect y="324" width="240" height="16" fill="#16a34a" />
      <rect x="75" y="327" width="90" height="7" rx="3" fill="white" opacity="0.85" />
    </svg>
  );
}

function FarmacyMockup({ scale, fill }: MockupProps) {
  const c = TEMPLATES.farmacy.colors;
  const s = (v: number) => (scale ?? 1) * v;
  const svgProps = fill
    ? { width: '100%' as const, height: 'auto' as const, viewBox: '0 0 240 340', style: { display: 'block' as const } }
    : { width: s(240), height: s(340), viewBox: '0 0 240 340', style: { display: 'block' as const } };

  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="fg-hero" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.accent} stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <rect width="240" height="340" fill={c.bg} />

      {/* promo bar */}
      <rect width="240" height="14" fill="url(#fg-hero)" />
      <rect x="60" y="4" width="120" height="6" rx="3" fill="white" opacity="0.9" />

      {/* header */}
      <rect y="14" width="240" height="26" fill="white" />
      <rect y="39" width="240" height="1" fill={c.primary} opacity="0.15" />
      <circle cx="22" cy="27" r="9" fill={c.primary} opacity="0.15" />
      <rect x="17" y="23" width="10" height="8" rx="1" fill={c.primary} opacity="0.7" />
      <rect x="38" y="22" width="48" height="10" rx="3" fill={c.primary} opacity="0.85" />
      <rect x="160" y="24" width="22" height="6" rx="3" fill={c.muted} opacity="0.4" />
      <rect x="188" y="24" width="22" height="6" rx="3" fill={c.muted} opacity="0.4" />
      <rect x="220" y="22" width="12" height="10" rx="3" fill={c.accent} opacity="0.2" />

      {/* hero */}
      <rect y="40" width="240" height="76" fill="url(#fg-hero)" opacity="0.12" />
      <rect y="40" width="240" height="76" fill="none" stroke={c.primary} strokeWidth="0" />
      <rect x="14" y="52" width="70" height="7" rx="3" fill={c.primary} opacity="0.8" />
      <rect x="14" y="64" width="140" height="13" rx="4" fill={c.text} opacity="0.9" />
      <rect x="14" y="82" width="100" height="7" rx="3" fill={c.text} opacity="0.45" />
      {/* stats inline */}
      <rect x="14" y="94" width="44" height="18" rx="6" fill={c.primary} />
      <rect x="18" y="99" width="36" height="8" rx="3" fill="white" opacity="0.9" />
      <rect x="64" y="94" width="60" height="18" rx="6" fill="transparent" stroke={c.primary} strokeWidth="1.5" strokeOpacity="0.5" />
      <rect x="68" y="99" width="52" height="8" rx="3" fill={c.primary} opacity="0.6" />

      {/* trust indicators */}
      <rect y="116" width="240" height="28" fill="white" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${4 + i * 60}, 120)`}>
          <circle cx="10" cy="10" r="9" fill={c.primary} opacity="0.1" />
          <rect x="5" y="7" width="10" height="6" rx="2" fill={c.primary} opacity="0.5" />
          <rect x="22" y="8" width="34" height="5" rx="2" fill={c.text} opacity="0.7" />
          <rect x="22" y="16" width="24" height="4" rx="2" fill={c.muted} opacity="0.4" />
        </g>
      ))}

      {/* categories */}
      <rect x="14" y="154" width="55" height="7" rx="3" fill={c.text} opacity="0.75" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${6 + i * 57}, 168)`}>
          <rect width="50" height="54" rx="12" fill="white" />
          <rect width="50" height="54" rx="12" fill="none" stroke={c.primary} strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="25" cy="22" r="13" fill={c.primary} opacity="0.12" />
          <rect x="10" y="15" width="30" height="14" rx="4" fill={c.primary} opacity="0.25" />
          <rect x="9" y="40" width="32" height="5" rx="2" fill={c.text} opacity="0.65" />
        </g>
      ))}

      {/* products */}
      <rect x="14" y="232" width="60" height="7" rx="3" fill={c.text} opacity="0.75" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${6 + i * 76}, 246)`}>
          <rect width="68" height="68" rx="10" fill="white" />
          <rect width="68" height="32" rx="10" fill={c.primary} opacity="0.1" />
          <circle cx="34" cy="16" r="10" fill={c.primary} opacity="0.2" />
          <rect x="6" y="38" width="48" height="6" rx="2" fill={c.text} opacity="0.75" />
          <rect x="6" y="48" width="30" height="7" rx="3" fill={c.accent} opacity="0.85" />
          <rect x="44" y="48" width="18" height="7" rx="3" fill={c.primary} opacity="0.9" />
          <rect x="46" y="50" width="14" height="3" rx="1" fill="white" opacity="0.9" />
        </g>
      ))}

      {/* footer */}
      <rect y="324" width="240" height="16" fill={c.primary} opacity="0.9" />
      <rect x="75" y="327" width="90" height="6" rx="3" fill="white" opacity="0.8" />
    </svg>
  );
}

function StoreMockup({ scale, fill }: MockupProps) {
  const c = TEMPLATES.store.colors;
  const s = (v: number) => (scale ?? 1) * v;
  const svgProps = fill
    ? { width: '100%' as const, height: 'auto' as const, viewBox: '0 0 240 340', style: { display: 'block' as const } }
    : { width: s(240), height: s(340), viewBox: '0 0 240 340', style: { display: 'block' as const } };

  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="sg-prod1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={c.muted} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="sg-prod2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.1" />
          <stop offset="100%" stopColor={c.accent} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <rect width="240" height="340" fill={c.bg} />

      {/* header */}
      <rect width="240" height="32" fill="white" />
      <rect y="31" width="240" height="1" fill="#e2e8f0" />
      <rect x="10" y="11" width="50" height="10" rx="3" fill={c.primary} opacity="0.85" />
      <rect x="76" y="13" width="28" height="6" rx="3" fill={c.muted} opacity="0.45" />
      <rect x="112" y="13" width="28" height="6" rx="3" fill={c.muted} opacity="0.45" />
      <rect x="148" y="13" width="28" height="6" rx="3" fill={c.muted} opacity="0.45" />
      {/* cart icon */}
      <rect x="195" y="9" width="16" height="14" rx="3" fill={c.primary} opacity="0.1" />
      <rect x="197" y="11" width="12" height="10" rx="2" fill="none" stroke={c.primary} strokeWidth="1.5" strokeOpacity="0.6" />
      <circle cx="218" cy="16" r="8" fill={c.accent} opacity="0.15" />
      <rect x="214" y="13" width="8" height="6" rx="2" fill={c.accent} opacity="0.7" />

      {/* hero banner */}
      <rect y="32" width="240" height="68" fill={c.hero} />
      <rect y="32" width="4" height="68" fill={c.accent} opacity="0.8" />
      <rect x="14" y="42" width="44" height="7" rx="3" fill={c.accent} opacity="0.8" />
      <rect x="14" y="54" width="130" height="13" rx="3" fill={c.primary} opacity="0.9" />
      <rect x="14" y="72" width="84" height="7" rx="3" fill={c.muted} opacity="0.5" />
      <rect x="14" y="84" width="60" height="12" rx="6" fill={c.primary} />
      <rect x="18" y="88" width="52" height="4" rx="2" fill="white" opacity="0.9" />
      {/* product hero image */}
      <rect x="162" y="36" width="68" height="60" rx="8" fill="url(#sg-prod2)" />
      <rect x="172" y="42" width="48" height="48" rx="6" fill={c.accent} opacity="0.1" />
      <rect x="180" y="48" width="32" height="36" rx="4" fill={c.primary} opacity="0.08" />
      <circle cx="196" cy="64" r="12" fill={c.accent} opacity="0.2" />

      {/* filter bar */}
      <rect x="6" y="106" width="228" height="18" rx="4" fill="#f8fafc" />
      <rect x="6" y="106" width="228" height="18" rx="4" fill="none" stroke="#e2e8f0" strokeWidth="1" />
      {['Todos', 'Novos', 'Oferta', 'Top'].map((_, i) => (
        <g key={i}>
          <rect x={12 + i * 56} y="110" width="46" height="10" rx="5"
            fill={i === 0 ? c.primary : 'transparent'}
            stroke={i === 0 ? 'none' : '#e2e8f0'} strokeWidth="1" />
          <rect x={16 + i * 56} y="113" width={i === 0 ? 38 : 28} height="4" rx="2"
            fill={i === 0 ? 'white' : c.muted} opacity={i === 0 ? 0.9 : 0.4} />
        </g>
      ))}

      {/* product grid 2x3 */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const grad = i % 2 === 0 ? 'url(#sg-prod1)' : 'url(#sg-prod2)';
        return (
          <g key={i} transform={`translate(${6 + col * 116}, ${130 + row * 62})`}>
            <rect width="108" height="54" rx="8" fill="#f8fafc" />
            <rect width="108" height="26" rx="8" fill={grad} />
            <circle cx="54" cy="13" r="8" fill={i % 3 === 0 ? c.accent : c.primary} opacity="0.15" />
            <rect x="8" y="30" width="62" height="5" rx="2" fill={c.primary} opacity="0.75" />
            <rect x="8" y="38" width="36" height="6" rx="3" fill={c.accent} opacity="0.9" />
            <rect x="84" y="37" width="18" height="8" rx="4" fill={c.primary} opacity="0.9" />
            <rect x="86" y="39.5" width="14" height="3" rx="1" fill="white" opacity="0.9" />
          </g>
        );
      })}

      {/* pagination dots */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={108 + i * 14} cy="330" r="4"
          fill={i === 0 ? c.primary : c.muted} opacity={i === 0 ? 0.9 : 0.3} />
      ))}
    </svg>
  );
}

function PortfolioMockup({ scale, fill }: MockupProps) {
  const c = TEMPLATES.portfolio.colors;
  const s = (v: number) => (scale ?? 1) * v;
  const svgProps = fill
    ? { width: '100%' as const, height: 'auto' as const, viewBox: '0 0 240 340', style: { display: 'block' as const } }
    : { width: s(240), height: s(340), viewBox: '0 0 240 340', style: { display: 'block' as const } };

  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="pg-radial" cx="80%" cy="20%" r="60%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.bg} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pg-avatar" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.accent} stopOpacity="0.4" />
        </radialGradient>
      </defs>

      <rect width="240" height="340" fill={c.bg} />
      <rect width="240" height="340" fill="url(#pg-radial)" />

      {/* header */}
      <rect width="240" height="28" fill={c.hero} />
      <rect x="10" y="9" width="46" height="10" rx="3" fill={c.primary} opacity="0.9" />
      <rect x="148" y="11" width="26" height="6" rx="3" fill={c.text} opacity="0.35" />
      <rect x="180" y="11" width="26" height="6" rx="3" fill={c.text} opacity="0.35" />
      <rect x="212" y="9" width="20" height="10" rx="5" fill={c.primary} opacity="0.25" />

      {/* hero */}
      <rect y="28" width="240" height="104" fill={c.hero} />
      {/* avatar photo placeholder */}
      <circle cx="185" cy="72" r="36" fill="url(#pg-avatar)" opacity="0.9" />
      <circle cx="185" cy="58" r="14" fill={c.primary} opacity="0.4" />
      <rect x="165" y="75" width="40" height="28" rx="12" fill={c.accent} opacity="0.3" />
      {/* hello badge */}
      <rect x="12" y="36" width="52" height="10" rx="5" fill={c.primary} opacity="0.2" />
      <rect x="16" y="39" width="44" height="4" rx="2" fill={c.primary} opacity="0.8" />
      {/* name */}
      <rect x="12" y="52" width="130" height="14" rx="4" fill={c.text} opacity="0.95" />
      <rect x="12" y="71" width="100" height="10" rx="3" fill={c.text} opacity="0.5" />
      {/* CTAs */}
      <rect x="12" y="86" width="62" height="18" rx="9" fill={c.primary} />
      <rect x="16" y="91" width="54" height="8" rx="3" fill={c.bg} opacity="0.9" />
      <rect x="80" y="86" width="62" height="18" rx="9" fill="transparent" stroke={c.muted} strokeWidth="1.5" />
      <rect x="84" y="91" width="54" height="8" rx="3" fill={c.text} opacity="0.45" />

      {/* stats row */}
      <rect y="132" width="240" height="30" fill={c.bg} opacity="0.6" />
      {[['50+', 'Projetos'], ['5★', 'Rating'], ['8', 'Anos'], ['100%', 'Entrega']].map(([num, label], i) => (
        <g key={i} transform={`translate(${4 + i * 60}, 134)`}>
          <rect width="54" height="26" rx="8" fill={c.hero} opacity="0.8" />
          <rect x="6" y="4" width="30" height="8" rx="2" fill={c.primary} opacity="0.9" />
          <rect x="6" y="14" width="42" height="6" rx="2" fill={c.text} opacity={0.4} />
        </g>
      ))}

      {/* skills / section */}
      <rect x="12" y="172" width="55" height="7" rx="3" fill={c.text} opacity="0.8" />
      <rect x="73" y="175" width="155" height="2" rx="1" fill={c.muted} opacity="0.2" />
      {['Design', 'Estratégia', 'Tecnologia'].map((_, i) => (
        <g key={i} transform={`translate(12, ${186 + i * 14})`}>
          <rect width="216" height="10" rx="5" fill={c.hero} opacity="0.7" />
          <rect width={80 + i * 36} height="10" rx="5" fill={c.primary} opacity={0.35 + i * 0.1} />
          <rect x="4" y="3" width={40 + i * 10} height="4" rx="2" fill={c.text} opacity="0.5" />
        </g>
      ))}

      {/* project grid */}
      <rect x="12" y="236" width="55" height="7" rx="3" fill={c.text} opacity="0.8" />
      {[0, 1, 2, 3].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <g key={i} transform={`translate(${6 + col * 116}, ${250 + row * 40})`}>
            <rect width="108" height="34" rx="8" fill={c.hero} />
            <rect width="108" height="16" rx="8" fill={c.primary} opacity={0.06 + (i % 2) * 0.06} />
            <rect x="4" y="20" width="64" height="5" rx="2" fill={c.text} opacity="0.7" />
            <rect x="84" y="18" width="20" height="8" rx="4" fill={c.accent} opacity="0.5" />
          </g>
        );
      })}

      {/* footer */}
      <rect y="330" width="240" height="10" fill={c.primary} opacity="0.12" />
      <rect x="85" y="333" width="70" height="4" rx="2" fill={c.text} opacity="0.3" />
    </svg>
  );
}

const MOCKUP_COMPONENTS: Record<TemplateId, React.ComponentType<MockupProps>> = {
  restaurant: RestaurantMockup,
  farmacy: FarmacyMockup,
  store: StoreMockup,
  portfolio: PortfolioMockup,
};

function TemplateModal({ id, onClose, onSelect, onPreview }: {
  id: TemplateId;
  onClose: () => void;
  onSelect: (id: TemplateId) => void;
  onPreview: (id: TemplateId) => void;
}) {
  const meta = TEMPLATES[id];
  const Mockup = MOCKUP_COMPONENTS[id];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-label-sm font-semibold text-primary">
              {meta.tag}
            </span>
            <h2 className="mt-1 text-title-lg font-bold">{meta.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-low text-on-surface-variant hover:bg-surface-med"
          >
            <X size={18} />
          </button>
        </div>

        {/* preview */}
        <div className="flex-1 overflow-auto">
          <div className="flex justify-center bg-surface-lowest px-6 py-8">
            <div className="overflow-hidden rounded-2xl shadow-architectural-lg" style={{ width: 'fit-content' }}>
              <Mockup scale={2.0} />
            </div>
          </div>

          {/* info */}
          <div className="px-6 py-5">
            <p className="text-body-md text-on-surface-variant">{meta.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-label-sm font-semibold text-on-surface-variant">Ideal para:</span>
              <span className="text-label-sm text-on-surface">{meta.segments}</span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex gap-3 border-t border-outline-variant px-6 py-4">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
            Fechar
          </button>
          <button
            type="button"
            onClick={() => { onPreview(id); onClose(); }}
            className="btn-ghost flex-1 justify-center gap-1.5 text-label-sm"
          >
            <Monitor size={14} /> Preview ao vivo
          </button>
          <button
            type="button"
            onClick={() => { onSelect(id); onClose(); }}
            className="btn-accent flex-1 justify-center"
          >
            <CheckCircle2 size={16} /> Usar este template
          </button>
        </div>
      </div>
    </div>
  );
}

export function TemplateSelector() {
  const { state, dispatch } = useQuiz();
  const [modalId, setModalId] = useState<TemplateId | null>(null);
  const [livePreviewOpen, setLivePreviewOpen] = useState(false);

  const suggested = (OBJECTIVE_TO_TEMPLATE[state.objective as ObjectiveId] ?? 'portfolio') as TemplateId;
  const active = ((state.template || suggested) as TemplateId);
  const isCustom = state.template !== '' && state.template !== suggested;

  // Auto-select suggested template if none chosen yet
  useEffect(() => {
    if (!state.template && suggested) {
      dispatch({ type: 'SET_TEMPLATE', payload: suggested });
    }
  }, [suggested, state.template, dispatch]);

  const handleSelect = (id: TemplateId) => {
    dispatch({ type: 'SET_TEMPLATE', payload: id });
  };

  return (
    <>
      {modalId && (
        <TemplateModal
          id={modalId}
          onClose={() => setModalId(null)}
          onSelect={handleSelect}
          onPreview={(tid) => { dispatch({ type: 'SET_TEMPLATE', payload: tid }); setModalId(null); setLivePreviewOpen(true); }}
        />
      )}

      {livePreviewOpen && (
        <LivePreview onClose={() => setLivePreviewOpen(false)} />
      )}

      <div className="grid grid-cols-2 gap-4">
        {ALL_TEMPLATES.map((id) => {
          const meta = TEMPLATES[id];
          const isActive = active === id;
          const isSuggested = id === suggested;
          const Mockup = MOCKUP_COMPONENTS[id];
          return (
            <div key={id} className="flex flex-col gap-2">
              <div
                className={`relative cursor-pointer overflow-hidden rounded-2xl transition-all ${
                  isActive
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-[color:var(--surface)]'
                    : 'ring-1 ring-[color:var(--outline-variant)] hover:ring-[color:var(--outline)]'
                }`}
                onClick={() => handleSelect(id)}
              >
                <Mockup fill />

                {/* hover overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end gap-1.5 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setModalId(id); }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/90 py-2 text-label-sm font-semibold text-gray-900 hover:bg-white"
                  >
                    <Eye size={13} /> Ver detalhes
                  </button>
                </div>

                {isActive && (
                  <span className="absolute right-2 top-2 rounded-full bg-primary p-1 text-white shadow">
                    <CheckCircle2 size={13} />
                  </span>
                )}
                {isSuggested && !isCustom && (
                  <span className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    Sugerido
                  </span>
                )}
              </div>
              <div className="px-0.5">
                <p className="text-label-sm font-semibold leading-tight">{meta.name}</p>
                <p className="mt-0.5 text-[11px] text-on-surface-variant">{meta.tag}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <p className="text-label-sm text-on-surface-variant">
          Passe o mouse para ver detalhes e uma prévia maior de cada template.
        </p>
        <button
          type="button"
          onClick={() => setLivePreviewOpen(true)}
          className="btn-ghost ml-auto gap-1.5 text-label-sm"
          disabled={!state.template}
        >
          <Monitor size={14} /> Preview ao vivo
        </button>
      </div>
    </>
  );
}
