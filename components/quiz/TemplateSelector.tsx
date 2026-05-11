'use client';

import { useState } from 'react';
import { CheckCircle2, X, Eye } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';
import { OBJECTIVE_TO_TEMPLATE, type TemplateId, type ObjectiveId } from '@/lib/quiz-data';

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
    segments: 'Restaurante, Beleza, Gastronomia',
    tag: 'Quente & Envolvente',
    colors: { bg: '#1c1917', hero: '#292524', primary: '#ea580c', accent: '#fbbf24', text: '#fafaf9', muted: '#78716c' },
  },
  farmacy: {
    name: 'Clínica & Saúde',
    description: 'Layout limpo e confiável, seção de especialidades, destaques de promoções e agendamento online.',
    segments: 'Clínica, Farmácia, Saúde',
    tag: 'Clean & Confiável',
    colors: { bg: '#f0fdf4', hero: '#dcfce7', primary: '#16a34a', accent: '#0284c7', text: '#14532d', muted: '#6b7280' },
  },
  store: {
    name: 'Loja & Comércio',
    description: 'Grid de produtos minimalista, carrinho de compras, filtros por categoria e checkout integrado.',
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

function RestaurantMockup({ scale = 1 }: { scale?: number }) {
  const c = TEMPLATES.restaurant.colors;
  const s = (v: number) => v * scale;
  return (
    <svg width={s(240)} height={s(320)} viewBox="0 0 240 320" style={{ display: 'block' }}>
      {/* bg */}
      <rect width="240" height="320" fill={c.bg} />
      {/* header */}
      <rect width="240" height="28" fill={c.primary} />
      <rect x="10" y="9" width="40" height="10" rx="3" fill={c.accent} opacity="0.9" />
      <rect x="170" y="10" width="30" height="8" rx="3" fill="white" opacity="0.3" />
      <rect x="205" y="10" width="25" height="8" rx="3" fill="white" opacity="0.3" />
      {/* hero */}
      <rect y="28" width="240" height="90" fill={c.hero} />
      <rect x="16" y="42" width="80" height="7" rx="3" fill={c.accent} opacity="0.8" />
      <rect x="16" y="54" width="140" height="14" rx="4" fill={c.text} opacity="0.9" />
      <rect x="16" y="73" width="100" height="10" rx="3" fill={c.text} opacity="0.45" />
      <rect x="16" y="89" width="72" height="20" rx="10" fill={c.primary} />
      <rect x="22" y="95" width="60" height="8" rx="3" fill="white" opacity="0.9" />
      {/* food image placeholder */}
      <rect x="160" y="36" width="68" height="68" rx="8" fill={c.primary} opacity="0.25" />
      <ellipse cx="194" cy="60" rx="20" ry="18" fill={c.primary} opacity="0.5" />
      <ellipse cx="194" cy="60" rx="12" ry="11" fill={c.accent} opacity="0.6" />
      {/* section label */}
      <rect x="16" y="128" width="52" height="7" rx="3" fill={c.primary} opacity="0.7" />
      <rect x="74" y="130" width="100" height="3" rx="1" fill={c.muted} opacity="0.3" />
      {/* menu cards row 1 */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${8 + i * 76}, 142)`}>
          <rect width="68" height="80" rx="8" fill={c.hero} />
          <rect width="68" height="38" rx="8" fill={c.muted} opacity="0.3" />
          <rect x="4" y="44" width="44" height="6" rx="2" fill={c.text} opacity="0.8" />
          <rect x="4" y="54" width="32" height="5" rx="2" fill={c.text} opacity="0.45" />
          <rect x="4" y="66" width="28" height="7" rx="3" fill={c.primary} opacity="0.9" />
          <rect x="36" y="66" width="28" height="7" rx="3" fill={c.accent} opacity="0.8" />
        </g>
      ))}
      {/* menu cards row 2 */}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${8 + i * 76}, 230)`}>
          <rect width="68" height="72" rx="8" fill={c.hero} />
          <rect width="68" height="34" rx="8" fill={c.muted} opacity="0.3" />
          <rect x="4" y="40" width="44" height="6" rx="2" fill={c.text} opacity="0.8" />
          <rect x="4" y="50" width="32" height="5" rx="2" fill={c.text} opacity="0.45" />
          <rect x="4" y="61" width="28" height="7" rx="3" fill={c.primary} opacity="0.7" />
        </g>
      ))}
      {/* whatsapp bar */}
      <rect y="305" width="240" height="15" fill="#16a34a" />
      <rect x="85" y="308" width="70" height="6" rx="3" fill="white" opacity="0.85" />
    </svg>
  );
}

function FarmacyMockup({ scale = 1 }: { scale?: number }) {
  const c = TEMPLATES.farmacy.colors;
  const s = (v: number) => v * scale;
  return (
    <svg width={s(240)} height={s(320)} viewBox="0 0 240 320" style={{ display: 'block' }}>
      <rect width="240" height="320" fill={c.bg} />
      {/* header */}
      <rect width="240" height="28" fill={c.primary} />
      <circle cx="18" cy="14" r="8" fill="white" opacity="0.25" />
      <rect x="10" y="10" width="6" height="8" rx="1" fill="white" opacity="0.8" />
      <rect x="7" y="13" width="12" height="3" rx="1" fill="white" opacity="0.8" />
      <rect x="35" y="10" width="40" height="8" rx="3" fill="white" opacity="0.8" />
      <rect x="170" y="10" width="58" height="8" rx="4" fill="white" opacity="0.2" />
      {/* hero */}
      <rect y="28" width="240" height="76" fill={c.hero} />
      <rect x="16" y="38" width="60" height="6" rx="3" fill={c.primary} opacity="0.7" />
      <rect x="16" y="49" width="130" height="12" rx="4" fill={c.text} opacity="0.9" />
      <rect x="16" y="66" width="90" height="8" rx="3" fill={c.text} opacity="0.45" />
      <rect x="16" y="80" width="68" height="18" rx="9" fill={c.primary} />
      <rect x="22" y="85" width="56" height="8" rx="3" fill="white" opacity="0.9" />
      {/* promo banner */}
      <rect y="104" width="240" height="28" fill={c.accent} opacity="0.9" />
      <rect x="16" y="111" width="100" height="7" rx="3" fill="white" opacity="0.9" />
      <rect x="170" y="109" width="54" height="12" rx="6" fill="white" opacity="0.25" />
      {/* search */}
      <rect x="12" y="140" width="216" height="18" rx="9" fill="white" />
      <rect x="12" y="140" width="216" height="18" rx="9" fill="none" stroke={c.primary} strokeWidth="1.5" opacity="0.5" />
      <rect x="22" y="146" width="80" height="6" rx="3" fill={c.muted} opacity="0.4" />
      <circle cx="220" cy="149" r="6" fill={c.primary} opacity="0.15" />
      {/* categories */}
      <rect x="16" y="168" width="52" height="6" rx="3" fill={c.text} opacity="0.7" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${8 + i * 58}, 182)`}>
          <rect width="50" height="50" rx="10" fill="white" />
          <rect width="50" height="50" rx="10" fill="none" stroke={c.primary} strokeWidth="1" opacity="0.3" />
          <circle cx="25" cy="20" r="10" fill={c.primary} opacity="0.15" />
          <rect x="8" y="34" width="34" height="5" rx="2" fill={c.text} opacity="0.6" />
          <rect x="12" y="42" width="26" height="4" rx="2" fill={c.muted} opacity="0.4" />
        </g>
      ))}
      {/* products */}
      <rect x="16" y="242" width="52" height="6" rx="3" fill={c.text} opacity="0.7" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${8 + i * 76}, 256)`}>
          <rect width="68" height="56" rx="8" fill="white" />
          <rect width="68" height="30" rx="8" fill={c.primary} opacity="0.12" />
          <rect x="4" y="34" width="44" height="5" rx="2" fill={c.text} opacity="0.75" />
          <rect x="4" y="43" width="28" height="6" rx="3" fill={c.accent} opacity="0.85" />
        </g>
      ))}
    </svg>
  );
}

function StoreMockup({ scale = 1 }: { scale?: number }) {
  const c = TEMPLATES.store.colors;
  const s = (v: number) => v * scale;
  return (
    <svg width={s(240)} height={s(320)} viewBox="0 0 240 320" style={{ display: 'block' }}>
      <rect width="240" height="320" fill={c.bg} />
      {/* header */}
      <rect width="240" height="32" fill="white" />
      <rect y="31" width="240" height="1" fill="#e2e8f0" />
      <rect x="10" y="11" width="50" height="10" rx="3" fill={c.primary} opacity="0.85" />
      <rect x="80" y="13" width="30" height="6" rx="3" fill={c.muted} opacity="0.5" />
      <rect x="118" y="13" width="30" height="6" rx="3" fill={c.muted} opacity="0.5" />
      <rect x="156" y="13" width="30" height="6" rx="3" fill={c.muted} opacity="0.5" />
      <circle cx="220" cy="16" r="8" fill={c.accent} opacity="0.15" />
      <rect x="215" y="12" width="10" height="8" rx="2" fill={c.accent} opacity="0.8" />
      {/* hero banner */}
      <rect y="32" width="240" height="72" fill={c.accent} opacity="0.08" />
      <rect y="32" width="240" height="72" fill="none" stroke={c.accent} strokeWidth="0" />
      <rect x="16" y="44" width="50" height="6" rx="3" fill={c.accent} opacity="0.7" />
      <rect x="16" y="55" width="130" height="12" rx="4" fill={c.primary} opacity="0.85" />
      <rect x="16" y="72" width="80" height="7" rx="3" fill={c.muted} opacity="0.5" />
      <rect x="16" y="84" width="64" height="14" rx="7" fill={c.primary} />
      <rect x="22" y="89" width="52" height="5" rx="2" fill="white" opacity="0.9" />
      {/* filter bar */}
      <rect x="8" y="110" width="224" height="18" rx="4" fill="#f8fafc" />
      {['Todos', 'Novos', 'Oferta', 'Top'].map((_, i) => (
        <g key={i}>
          <rect x={14 + i * 56} y="114" width="44" height="10" rx="5"
            fill={i === 0 ? c.primary : 'transparent'}
            stroke={i === 0 ? 'none' : '#e2e8f0'} strokeWidth="1" />
          <rect x={18 + i * 56} y="117" width={i === 0 ? 36 : 28} height="4" rx="2"
            fill={i === 0 ? 'white' : c.muted} opacity={i === 0 ? 0.9 : 0.4} />
        </g>
      ))}
      {/* product grid 2x3 */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <g key={i} transform={`translate(${8 + col * 116}, ${136 + row * 58})`}>
            <rect width="108" height="50" rx="8" fill="#f8fafc" />
            <rect width="108" height="25" rx="8" fill={c.muted} opacity="0.15" />
            {/* product icon */}
            <rect x="42" y="4" width="24" height="18" rx="4" fill={c.accent} opacity="0.2" />
            <rect x="8" y="30" width="60" height="5" rx="2" fill={c.primary} opacity="0.75" />
            <rect x="8" y="38" width="35" height="5" rx="2" fill={c.accent} opacity="0.85" />
            <rect x="82" y="36" width="18" height="8" rx="4" fill={c.primary} opacity="0.9" />
            <rect x="84" y="38.5" width="14" height="3" rx="1" fill="white" opacity="0.9" />
          </g>
        );
      })}
      {/* pagination */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={108 + i * 16} cy="312" r="4"
          fill={i === 0 ? c.primary : c.muted} opacity={i === 0 ? 0.9 : 0.3} />
      ))}
    </svg>
  );
}

function PortfolioMockup({ scale = 1 }: { scale?: number }) {
  const c = TEMPLATES.portfolio.colors;
  const s = (v: number) => v * scale;
  return (
    <svg width={s(240)} height={s(320)} viewBox="0 0 240 320" style={{ display: 'block' }}>
      <rect width="240" height="320" fill={c.bg} />
      {/* header */}
      <rect width="240" height="30" fill={c.hero} />
      <rect x="10" y="10" width="50" height="10" rx="3" fill={c.primary} opacity="0.9" />
      <rect x="150" y="12" width="28" height="6" rx="3" fill={c.text} opacity="0.35" />
      <rect x="184" y="12" width="28" height="6" rx="3" fill={c.text} opacity="0.35" />
      <rect x="10" y="29" width="220" height="1" fill={c.muted} opacity="0.2" />
      {/* hero */}
      <rect y="30" width="240" height="100" fill={c.hero} />
      <rect x="16" y="44" width="40" height="6" rx="3" fill={c.primary} opacity="0.6" />
      <rect x="16" y="55" width="160" height="16" rx="4" fill={c.text} opacity="0.9" />
      <rect x="16" y="76" width="120" height="9" rx="3" fill={c.text} opacity="0.4" />
      <rect x="16" y="91" width="65" height="18" rx="9" fill={c.primary} />
      <rect x="22" y="97" width="53" height="6" rx="3" fill={c.bg} opacity="0.9" />
      <rect x="88" y="91" width="65" height="18" rx="9" fill="transparent"
        stroke={c.muted} strokeWidth="1.5" />
      <rect x="94" y="97" width="53" height="6" rx="3" fill={c.text} opacity="0.55" />
      {/* skills row */}
      <rect y="130" width="240" height="22" fill={c.bg} opacity="0.5" />
      {['Estratégia', 'Design', 'Tecnologia', 'Marketing'].map((_, i) => (
        <g key={i}>
          <rect x={8 + i * 58} y="135" width="50" height="12" rx="6"
            fill={i === 0 ? c.primary : c.hero}
            opacity={i === 0 ? 0.9 : 0.8} />
          <rect x={12 + i * 58} y="138.5" width={i === 0 ? 42 : 32} height="5" rx="2"
            fill={i === 0 ? c.bg : c.muted} opacity={i === 0 ? 0.9 : 0.5} />
        </g>
      ))}
      {/* section */}
      <rect x="16" y="162" width="60" height="7" rx="3" fill={c.text} opacity="0.8" />
      <rect x="82" y="165" width="142" height="2" rx="1" fill={c.muted} opacity="0.2" />
      {/* projects grid */}
      {[0, 1, 2, 3].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <g key={i} transform={`translate(${8 + col * 116}, ${176 + row * 66})`}>
            <rect width="108" height="58" rx="10" fill={c.hero} />
            <rect width="108" height="32" rx="10" fill={c.primary} opacity={0.08 + (i % 3) * 0.04} />
            <rect x="4" y="36" width="70" height="6" rx="2" fill={c.text} opacity="0.75" />
            <rect x="4" y="46" width="48" height="5" rx="2" fill={c.muted} opacity="0.5" />
            <rect x="84" y="44" width="20" height="7" rx="4" fill={c.accent} opacity="0.6" />
          </g>
        );
      })}
      {/* footer */}
      <rect y="308" width="240" height="12" fill={c.primary} opacity="0.15" />
      <rect x="90" y="311" width="60" height="5" rx="2" fill={c.text} opacity="0.3" />
    </svg>
  );
}

const MOCKUP_COMPONENTS: Record<TemplateId, React.ComponentType<{ scale?: number }>> = {
  restaurant: RestaurantMockup,
  farmacy: FarmacyMockup,
  store: StoreMockup,
  portfolio: PortfolioMockup,
};

function TemplateModal({ id, onClose, onSelect }: {
  id: TemplateId;
  onClose: () => void;
  onSelect: (id: TemplateId) => void;
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
              <Mockup scale={1.5} />
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

  const suggested = (OBJECTIVE_TO_TEMPLATE[state.objective as ObjectiveId] ?? 'portfolio') as TemplateId;
  const active = ((state.template || suggested) as TemplateId);
  const isCustom = state.template !== '' && state.template !== suggested;

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
        />
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                <Mockup scale={1} />

                {/* overlay botões */}
                <div className="absolute inset-0 flex flex-col items-center justify-end gap-1.5 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setModalId(id); }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/90 py-1.5 text-label-sm font-semibold text-gray-900 hover:bg-white"
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

      <p className="mt-3 text-label-sm text-on-surface-variant">
        Passe o mouse sobre um template para ver detalhes e uma prévia maior.
      </p>
    </>
  );
}
