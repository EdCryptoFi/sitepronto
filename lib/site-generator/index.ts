import { parseAICopyFromNotes, type AICopy } from '@/lib/ai-copy';
import type { ImageSet } from '@/lib/image-bank';
import { dataUrl, generateHeroSVG, generateProductSVG, generateGallerySVG, generateAvatarSVG, generateBgPattern } from '@/lib/image-service';
import { detectIndustry, validateAIContent, getIndustryById, type IndustryInfo } from '@/lib/industry';
import { generateJSONLD, generateOGTags } from '@/lib/copy-framework';
import { renderNav, renderHero, renderServices } from '@/lib/site-generator/layouts';

export type SiteBriefing = {
  id: string;
  segment: string;
  goal: string;
  palette: string;
  template: string;
  selected_modules: string[];
  domain: string | null;
  domain_choice: string;
  whatsapp_number: string | null;
  business_hours: string | null;
  catalog_products: Array<{ id?: string; name: string; price: string; imagePreview?: string }>;
  content_notes: string | null;
  logo_name: string | null;
  created_at: string;
};

type Palette = { primary: string; accent: string; light: string; dark: string };

const PALETTES: Record<string, Palette> = {
  'azul-editorial': { primary: '#004ac6', accent: '#2563eb', light: '#dbe6ff', dark: '#001d4a' },
  'verde-servico':  { primary: '#0f766e', accent: '#14b8a6', light: '#ccfbf1', dark: '#042f2e' },
  'vinho-premium':  { primary: '#7f1d1d', accent: '#be123c', light: '#ffe4e6', dark: '#3b0000' },
  'minimal':    { primary: '#374151', accent: '#6b7280', light: '#f3f4f6', dark: '#111827' },
  'vibrant':    { primary: '#004ac6', accent: '#eab308', light: '#fef9c3', dark: '#001d4a' },
  'corporate':  { primary: '#002855', accent: '#004ac6', light: '#dbe1ff', dark: '#001029' },
  'nature':     { primary: '#059669', accent: '#f97316', light: '#d1fae5', dark: '#022c22' },
  'tech':       { primary: '#111827', accent: '#06b6d4', light: '#cffafe', dark: '#030712' },
  'elegant':    { primary: '#2b1b17', accent: '#b58e58', light: '#f5f1ed', dark: '#0f0805' },
};

const WA_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.857L0 24l6.335-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-5.007-1.374l-.36-.213-3.724.882.93-3.618-.234-.372A9.794 9.794 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>`;

function formatBusinessName(domain: string | null, segment: string): string {
  if (!domain) {
    const map: Record<string, string> = {
      restaurante: 'Nosso Restaurante', clinica: 'Nossa Clínica', advocacia: 'Advocacia',
      loja: 'Nossa Loja', beleza: 'Studio de Beleza', educacao: 'Escola / Cursos',
      servicos: 'Nossos Serviços', outro: 'Nosso Negócio',
    };
    return map[segment] ?? 'Meu Negócio';
  }
  return domain.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function whatsappLink(number: string | null): string {
  if (!number) return 'https://wa.me/5511999999999';
  const digits = number.replace(/\D/g, '');
  const full = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${full}`;
}

function waFloat(waLink: string): string {
  return `
<a href="${waLink}" target="_blank" class="wa-float" aria-label="Falar pelo WhatsApp">
  ${WA_SVG}
</a>`;
}

// ─── SHARED SECTION HELPERS ──────────────────────────────────────────────────

function catalogSection(products: SiteBriefing['catalog_products'], pal: Palette, dark = false, industryId = 'generico'): string {
  const prodImg = dataUrl(generateProductSVG(pal, industryId));
  const items = (products && products.length > 0)
    ? products.map((p, i) => {
        const img = p.imagePreview
          ? `<img src="${p.imagePreview}" alt="${p.name}" style="width:100%;height:180px;object-fit:cover">`
          : `<img src="${prodImg}" alt="${p.name || 'Item'}" style="width:100%;height:180px;object-fit:cover">`;
        return `
      <div class="item-card">
        ${img}
        <div class="item-body">
          <span class="item-name">${p.name || 'Item'}</span>
          ${p.price ? `<span class="item-price" style="color:${pal.accent}">${p.price}</span>` : ''}
          <button class="item-btn" style="background:${pal.primary}">Saiba mais</button>
        </div>
      </div>`;
      }).join('')
    : [1,2,3,4,5,6].map((i) => `
      <div class="item-card">
        <img src="${prodImg}" alt="Item ${i}" style="width:100%;height:180px;object-fit:cover">
        <div class="item-body">
          <span class="item-name">Item ${i}</span>
          <button class="item-btn" style="background:${pal.primary}">Saiba mais</button>
        </div>
      </div>`).join('');
  const bg = dark ? 'var(--surface)' : 'var(--surface2,#f8fafc)';
  return `
<section id="servicos" class="section-animate" style="padding:80px 0;background:${bg}">
  <div class="container">
    <div class="sec-hdr centered">
      <span class="eyebrow" style="color:${pal.primary}">Catálogo</span>
      <h2 class="sec-title">Nossos produtos e serviços</h2>
    </div>
    <div class="items-grid">${items}</div>
  </div>
</section>`;
}

function hoursSection(hours: string | null, waLink: string, pal: Palette): string {
  if (!hours) return '';
  const rows = hours.split('\n').filter(Boolean).map((line) => {
    const [day, ...rest] = line.split(':');
    return `<tr><td class="h-day">${day.trim()}</td><td class="h-val">${rest.join(':').trim()}</td></tr>`;
  }).join('');
  return `
<section id="horarios" class="section-animate" style="padding:80px 0">
  <div class="container">
    <div class="sec-hdr centered">
      <span class="eyebrow" style="color:${pal.primary}">Horários</span>
      <h2 class="sec-title">Quando estamos disponíveis</h2>
    </div>
    <div style="max-width:520px;margin:0 auto;text-align:center">
      <table class="hours-table">
        <tbody>${rows}</tbody>
      </table>
      <a href="${waLink}?text=Olá!%20Gostaria%20de%20agendar%20um%20horário." target="_blank" class="btn-wa-inline" style="background:#16a34a">
        ${WA_SVG} Agendar pelo WhatsApp
      </a>
    </div>
  </div>
</section>`;
}

function gallerySection(pal: Palette, dark = false, industryId = 'generico', galleryImages?: string[]): string {
  const tags = ['Projeto', 'Trabalho', 'Cliente', 'Case', 'Portfolio', 'Resultado'];
  const bg = dark ? 'var(--surface)' : 'var(--surface2,#f8fafc)';
  return `
<section id="galeria" class="section-animate" style="padding:80px 0;background:${bg}">
  <div class="container">
    <div class="sec-hdr centered">
      <span class="eyebrow" style="color:${pal.primary}">Galeria</span>
      <h2 class="sec-title">Nossos trabalhos</h2>
      <p class="sec-sub">Conheça alguns projetos que realizamos para nossos clientes.</p>
    </div>
    <div class="gallery-grid">
      ${[0,1,2,3,4,5].map((i) => {
        const realImg = galleryImages?.[i % (galleryImages.length || 1)];
        const src = realImg ?? dataUrl(generateGallerySVG(pal, i, industryId));
        return `
      <div class="gallery-card">
        <img src="${src}" alt="Trabalho ${i + 1}" style="width:100%;height:180px;object-fit:cover;display:block" ${realImg ? 'referrerpolicy="no-referrer"' : ''}>
        <div class="gallery-body">
          <span class="gallery-tag" style="color:${pal.primary}">${tags[i]}</span>
          <p class="gallery-name">Trabalho ${i + 1}</p>
        </div>
      </div>`;
      }).join('')}
    </div>
  </div>
</section>`;
}

function testimonialsSection(pal: Palette, dark = false): string {
  const names = ['Ana Silva', 'Carlos Mendes', 'Fernanda Lima'];
  const roles = ['Cliente fiel', 'Parceiro', 'Cliente satisfeita'];
  const texts = [
    'Atendimento impecável e resultado acima das expectativas. Recomendo a todos!',
    'Profissionalismo e qualidade em cada detalhe. Voltarei com certeza.',
    'Equipe atenciosa, pontual e comprometida com o cliente. Nota 10!',
  ];
  const bg = dark ? 'var(--surface2,#0f172a)' : 'var(--bg,#ffffff)';
  return `
<section id="depoimentos" class="section-animate" style="padding:80px 0;background:${bg}">
  <div class="container">
    <div class="sec-hdr centered">
      <span class="eyebrow" style="color:${pal.primary}">Depoimentos</span>
      <h2 class="sec-title">O que nossos clientes dizem</h2>
    </div>
    <div class="testimonials-grid">
      ${names.map((n, i) => `
      <div class="testimonial-card">
        <div style="color:${pal.accent};font-size:1.2rem;margin-bottom:12px">★★★★★</div>
        <p class="testimonial-text">"${texts[i]}"</p>
        <div class="testimonial-author">
          <img src="${dataUrl(generateAvatarSVG(pal, n.charAt(0)))}" alt="${n}" class="testimonial-avatar" style="width:44px;height:44px;border-radius:50%;flex-shrink:0;display:block">
          <div>
            <div class="testimonial-name">${n}</div>
            <div class="testimonial-role">${roles[i]}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}

function aboutSection(description: string, pal: Palette, ai?: AICopy | null): string {
  const text = description || ai?.about_text || '';
  if (!text) return '';
  return `
<section id="sobre" class="section-animate" style="padding:80px 0">
  <div class="container">
    <div style="max-width:760px;margin:0 auto;text-align:center">
      <span class="eyebrow" style="color:${pal.primary}">Sobre nós</span>
      <h2 class="sec-title" style="margin-top:10px">Nossa história</h2>
      <p style="color:var(--muted);margin-top:20px;font-size:1.05rem;line-height:1.8">${description}</p>
    </div>
  </div>
</section>`;
}

function faqSection(pal: Palette, ai?: AICopy | null): string {
  const items = ai?.faq && ai.faq.length >= 3 ? ai.faq : [
    { q: 'Como posso entrar em contato?', a: 'Fale conosco pelo WhatsApp — é a forma mais rápida. Respondemos em instantes.' },
    { q: 'Quais são os horários de atendimento?', a: 'Atendemos de segunda a sexta, das 9h às 18h. Sábados das 9h às 13h.' },
    { q: 'Como solicito um orçamento?', a: 'Entre em contato pelo WhatsApp e retornamos em até 24 horas com todas as informações.' },
  ];
  return `
<section id="faq" class="section-animate" style="padding:80px 0">
  <div class="container">
    <div class="sec-hdr centered">
      <span class="eyebrow" style="color:${pal.primary}">Dúvidas</span>
      <h2 class="sec-title">Perguntas frequentes</h2>
    </div>
    <div style="max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:12px">
      ${items.map(item => `
      <div class="faq-item" style="border-color:${pal.primary}22">
        <p class="faq-q">${item.q}</p>
        <p class="faq-a">${item.a}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}

// ─── STYLE VARIATIONS ────────────────────────────────────────────────────────

export type StyleVariationId = 'modern' | 'classic' | 'bold';

export type StyleVariation = {
  id: StyleVariationId;
  name: string;
  label: string;
  css: string;
};

export const STYLE_VARIATIONS: StyleVariation[] = [
  {
    id: 'modern',
    name: 'Moderno',
    label: 'Limpo e arejado, cantos arredondados, sombras suaves',
    css: `
:root{--radius-sm:8px;--radius-md:14px;--radius-lg:20px;--shadow-sm:0 2px 8px rgba(0,0,0,.06);--shadow-md:0 8px 30px rgba(0,0,0,.08);--shadow-lg:0 12px 40px rgba(0,0,0,.12);--space-sm:8px;--space-md:16px;--space-lg:24px;--space-xl:32px;--space-xxl:48px;--font-scale:1}
.item-card{border-radius:var(--radius-lg);box-shadow:var(--shadow-sm)}
.item-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-4px)}
.gallery-card{border-radius:var(--radius-lg)}
.gallery-thumb{height:180px}
.testimonial-card{border-radius:var(--radius-lg);padding:28px}
.faq-item{border-radius:var(--radius-md);padding:24px}
.btn-wa-inline{border-radius:var(--radius-md)}
.wa-float{width:56px;height:56px}
.item-btn{border-radius:var(--radius-sm)}
section{padding:var(--space-xxl,80px) 0}
.hero-content{padding:60px 0}
.hero-visual{border-radius:var(--radius-lg)}
`,
  },
  {
    id: 'classic',
    name: 'Clássico',
    label: 'Tradicional, cantos retos, tipografia formal, espaçamento generoso',
    css: `
:root{--radius-sm:2px;--radius-md:4px;--radius-lg:6px;--shadow-sm:none;--shadow-md:0 2px 12px rgba(0,0,0,.06);--shadow-lg:0 4px 20px rgba(0,0,0,.08);--space-sm:10px;--space-md:20px;--space-lg:32px;--space-xl:44px;--space-xxl:64px;--font-scale:1.05}
.sec-title{font-size:clamp(1.5rem,3.2vw,2.2rem)!important;letter-spacing:-.01em}
.item-card{border-radius:var(--radius-sm);border:1px solid rgba(0,0,0,.06)}
.gallery-card{border-radius:var(--radius-sm)}
.testimonial-card{border-radius:var(--radius-md);padding:32px;border:1px solid}
.faq-item{border-radius:var(--radius-sm);padding:28px;border-left:4px solid var(--primary)}
.hero-visual{border-radius:var(--radius-md)}
.item-btn{border-radius:var(--radius-sm)}
.btn-wa-inline{border-radius:var(--radius-sm)}
.wa-float{border-radius:var(--radius-sm);width:52px;height:52px}
section{padding:var(--space-xxl,80px) 0}
.hero-content{padding:72px 0}
`,
  },
  {
    id: 'bold',
    name: 'Impactante',
    label: 'Alto contraste, fontes grandes, sombras fortes, bordas marcantes',
    css: `
:root{--radius-sm:12px;--radius-md:18px;--radius-lg:28px;--shadow-sm:0 4px 16px rgba(0,0,0,.1);--shadow-md:0 12px 40px rgba(0,0,0,.14);--shadow-lg:0 20px 60px rgba(0,0,0,.18);--space-sm:6px;--space-md:14px;--space-lg:28px;--space-xl:40px;--space-xxl:60px;--font-scale:1.12}
.sec-title{font-size:clamp(2rem,4vw,2.8rem)!important;font-weight:900!important;letter-spacing:-.02em}
.hero-title{font-size:clamp(2.2rem,4.5vw,3.2rem)!important;font-weight:900!important}
.item-card{border-radius:var(--radius-sm);box-shadow:var(--shadow-md)}
.item-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-6px) scale(1.01)}
.gallery-card{border-radius:var(--radius-sm)}
.testimonial-card{border-radius:var(--radius-sm);padding:32px;border:3px solid var(--primary);box-shadow:var(--shadow-md)}
.faq-item{border-radius:var(--radius-lg);padding:28px;border:2px solid;background:rgba(0,0,0,.02)}
.hero-visual{border-radius:var(--radius-lg)}
.item-btn{border-radius:var(--radius-lg);padding:12px 20px!important;font-weight:800!important}
.btn-wa-inline{border-radius:var(--radius-lg);padding:16px 32px!important;font-weight:800!important}
.wa-float{width:60px;height:60px;box-shadow:0 6px 32px rgba(22,163,74,.6)!important}
section{padding:var(--space-xxl,80px) 0}
.hero-content{padding:48px 0}
.hero-stats .stat-n{font-size:2rem!important}
`,
  },
];

// ─── SHARED BASE CSS ──────────────────────────────────────────────────────────

const FONT_PAIRS: Record<string, { heading: string; body: string }> = {
  restaurant: { heading: 'Playfair+Display:ital,wght@0,400;0,700;1,400', body: 'Inter:wght@400;500;600;700;800' },
  farmacy:    { heading: 'Merriweather:wght@400;700', body: 'Inter:wght@400;500;600;700;800' },
  store:      { heading: 'Poppins:wght@400;600;700;800', body: 'Inter:wght@400;500;600;700;800' },
  portfolio:  { heading: 'Outfit:wght@400;600;700;800;900', body: 'DM+Sans:wght@400;500;700' },
};

function fontLink(tpl: string): string {
  const pair = FONT_PAIRS[tpl] ?? FONT_PAIRS.portfolio;
  return `https://fonts.googleapis.com/css2?family=${pair.heading}&family=${pair.body}&display=swap`;
}

function fontCSS(tpl: string): string {
  const pair = FONT_PAIRS[tpl] ?? FONT_PAIRS.portfolio;
  return `body{font-family:'${pair.body.split(':')[0].replace(/\+/g, ' ')}',system-ui,sans-serif;line-height:1.6}
h1,h2,h3,h4,h5,h6,.logo,.hero-title,.sec-title,.item-name,.item-price{font-family:'${pair.heading.split(':')[0].replace(/\+/g, ' ')}',serif}`;
}

const BASE_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:1100px;margin:0 auto;padding:0 24px}
/* animations */
.section-animate{animation:fadeInUp .6s ease both}
@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
/* section headers */
.sec-hdr{margin-bottom:48px}
.sec-hdr.centered{text-align:center}
.eyebrow{font-size:.76rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;display:block;margin-bottom:8px}
.sec-title{font-size:clamp(1.7rem,3vw,2.4rem);font-weight:800;line-height:1.15}
.sec-sub{margin-top:12px;font-size:1rem;opacity:.7}
/* items/catalog grid */
.items-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px}
.item-card{border-radius:20px;overflow:hidden;transition:transform .2s,box-shadow .2s}
.item-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.12)}
.item-photo{height:180px;position:relative;display:flex;align-items:center;justify-content:center}
.item-photo-circle{width:70px;height:70px;border-radius:50%}
.item-body{padding:16px;display:flex;flex-direction:column;gap:6px}
.item-name{font-weight:700;font-size:.95rem}
.item-price{font-weight:800;font-size:1.05rem}
.item-btn{margin-top:8px;padding:10px 16px;border:none;border-radius:10px;color:#fff;font-weight:700;font-size:.85rem;cursor:pointer;transition:opacity .2s}
.item-btn:hover{opacity:.85}
/* gallery */
.gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}
.gallery-card{border-radius:20px;overflow:hidden;transition:transform .2s}
.gallery-card:hover{transform:translateY(-4px)}
.gallery-thumb{height:180px}
.gallery-body{padding:16px}
.gallery-tag{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;display:block}
.gallery-name{font-size:.95rem;font-weight:700;margin-top:4px}
/* testimonials */
.testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}
.testimonial-card{border-radius:20px;padding:28px;border-width:1px;border-style:solid}
.testimonial-text{font-size:.95rem;line-height:1.7;font-style:italic;opacity:.85}
.testimonial-author{display:flex;align-items:center;gap:14px;margin-top:20px}
.testimonial-avatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;color:#fff;flex-shrink:0}
.testimonial-name{font-weight:700;font-size:.9rem}
.testimonial-role{font-size:.8rem;opacity:.6;margin-top:2px}
/* hours */
.hours-table{width:100%;margin:0 auto 0;border-collapse:collapse;margin-bottom:28px}
.h-day{padding:10px 16px;font-weight:600;font-size:.9rem;text-align:left;opacity:.8}
.h-val{padding:10px 16px;font-size:.9rem;text-align:right}
/* faq */
.faq-item{border-radius:16px;padding:24px;border:1px solid}
.faq-q{font-weight:700;margin-bottom:8px}
.faq-a{font-size:.9rem;line-height:1.7;opacity:.7}
/* wa buttons */
.btn-wa-inline{display:inline-flex;align-items:center;gap:10px;background:#16a34a;color:#fff;padding:14px 28px;border-radius:14px;font-weight:700;font-size:.95rem;transition:opacity .2s}
.btn-wa-inline:hover{opacity:.88}
/* wa float */
.wa-float{position:fixed;bottom:24px;right:24px;z-index:999;width:56px;height:56px;border-radius:50%;background:#16a34a;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(22,163,74,.55);transition:transform .2s;color:#fff}
.wa-float:hover{transform:scale(1.1)}
@media(max-width:768px){
  .container{padding:0 16px}
  .nav-links{display:none!important}
  .nav-icons{margin-left:auto!important}
  .logo{font-size:1.1rem!important}
  .hero-split{flex-direction:column!important}
  .hero-content{padding:32px 0!important;text-align:center!important}
  .hero-content .hero-title{font-size:clamp(1.5rem,6vw,1.8rem)!important}
  .hero-content .hero-sub{font-size:.9rem!important}
  .hero-content .hero-ctas{justify-content:center!important}
  .hero-content .hero-stats{justify-content:center!important;flex-wrap:wrap!important;gap:8px!important}
  .hero-visual{min-height:200px!important;max-height:240px!important;width:100%!important;margin-top:0!important}
  .hero-badge{font-size:.75rem!important;padding:4px 12px!important}
  .hero-tag,.hello-tag,.rating-badge{justify-content:center!important}
  .sec-title{font-size:clamp(1.2rem,5vw,1.6rem)!important}
  .sec-hdr{margin-bottom:28px!important}
  .items-grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))!important;gap:12px!important}
  .item-card{border-radius:14px!important}
  .item-body{padding:12px!important}
  .item-name{font-size:.85rem!important}
  .item-price{font-size:.9rem!important}
  .item-btn{padding:8px 12px!important;font-size:.78rem!important;margin-top:4px!important}
  .gallery-grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))!important;gap:12px!important}
  .gallery-body{padding:12px!important}
  .testimonials-grid{grid-template-columns:1fr!important;gap:16px!important}
  .testimonial-card{padding:20px!important}
  .testimonial-text{font-size:.88rem!important}
  .services-grid{grid-template-columns:1fr!important;gap:16px!important}
  .service-card{padding:20px!important}
  .feats-grid,.features-row{grid-template-columns:1fr!important;gap:16px!important}
  .stats-row{flex-wrap:wrap!important;gap:8px!important;justify-content:center!important}
  .stat-n{font-size:1.1rem!important}
  .stat-l{font-size:.75rem!important}
  .hours-table{font-size:.8rem!important}
  .h-day,.h-val{padding:8px 10px!important}
  .faq-item{padding:16px!important}
  .faq-q{font-size:.9rem!important}
  .cats-grid{grid-template-columns:repeat(2,1fr)!important;gap:12px!important}
  .project-grid{grid-template-columns:repeat(2,1fr)!important;gap:12px!important}
  .btn-wa-inline{padding:12px 20px!important;font-size:.88rem!important;width:100%!important;justify-content:center!important}
  .wa-float{bottom:16px!important;right:16px!important;width:48px!important;height:48px!important}
  .promo-bar{font-size:.78rem!important;padding:6px 12px!important;text-align:center!important}
  .trust-strip .container{flex-wrap:wrap!important;gap:8px!important;justify-content:center!important}
  .trust-item{font-size:.8rem!important}
  .cta-section{padding:40px 0!important;text-align:center!important}
  .cta-title{font-size:1.2rem!important}
  .cta-sub{font-size:.9rem!important}
  .cta-band{flex-direction:column!important;text-align:center!important;gap:16px!important}
  .food-visual{max-height:180px!important}
  .product-visual{max-height:180px!important}
  .filter-bar{overflow-x:auto!important;gap:6px!important;padding:8px 4px!important}
  .filter-pill{white-space:nowrap!important;font-size:.75rem!important;padding:4px 10px!important}
  .avatar-wrap{flex-direction:column!important;text-align:center!important}
  .avatar-badge{justify-content:center!important}
  .hero-role{font-size:.85rem!important}
  .footer-inner{flex-direction:column!important;text-align:center!important;gap:12px!important}
  .contact-row{flex-direction:column!important;gap:12px!important}
  .contact-card{padding:16px!important}
  section{padding:48px 0!important}
  header{padding:12px 0!important}
}
@media(max-width:480px){
  .items-grid{grid-template-columns:repeat(2,1fr)!important}
  .gallery-grid{grid-template-columns:repeat(2,1fr)!important}
  .cats-grid{grid-template-columns:repeat(2,1fr)!important;gap:8px!important}
  .container{padding:0 12px}
  .hero-content{padding:24px 0!important}
  .hero-title{font-size:1.3rem!important}
  .sec-title{font-size:1.1rem!important}
  section{padding:36px 0!important}
  .testimonial-card{padding:16px!important}
  .service-card{padding:16px!important}
}
`;

// ─── RESTAURANT TEMPLATE ──────────────────────────────────────────────────────
function generateRestaurant(b: SiteBriefing, pal: Palette, name: string, waLink: string, description: string, ai?: AICopy | null, variation?: StyleVariationId, industryId?: string, logoPreview?: string, images?: ImageSet): string {
  const mods = b.selected_modules ?? [];
  const industry = getIndustryById(industryId ?? 'generico');
  const services = ai?.services ?? industry?.fallbackServices ?? [
    { icon: '🌟', name: 'Ingredientes Frescos', description: 'Selecionamos os melhores ingredientes para cada prato, garantindo sabor e qualidade.' },
    { icon: '🚀', name: 'Atendimento Rápido', description: 'Pedidos ágeis pelo WhatsApp, sem espera e com entrega no prazo combinado.' },
    { icon: '❤️', name: 'Receitas Exclusivas', description: 'Pratos únicos preparados com carinho e técnica artesanal para você.' },
  ];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<meta name="description" content="${(ai?.hero_subheadline ?? name).replace(/"/g, '&quot;')}" />
<meta property="og:title" content="${name.replace(/"/g, '&quot;')}" />
<meta property="og:description" content="${(ai?.hero_subheadline ?? name).replace(/"/g, '&quot;')}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="keywords" content="${(ai?.seo_keywords ?? [name]).join(', ')}" />
<meta name="robots" content="index,follow" />
<script type="application/ld+json">${(() => { const wa = b.whatsapp_number ?? '5511999999999'; const se = (ai?.hero_subheadline ?? name).replace(/"/g, '&quot;'); return JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name, description: se, url: `https://${b.domain || 'sitepronto.com.br'}`, telephone: wa, priceRange: '$' }); })()}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${fontLink(b.template)}" rel="stylesheet">
<style>
${BASE_CSS}
${fontCSS(b.template)}
:root{--primary:${pal.primary};--accent:${pal.accent};--light:${pal.light};--bg:#1a1614;--surface:#252120;--surface2:#2e2b29;--text:#fafaf9;--muted:#a8a29e}
body{background:var(--bg);color:var(--text)}
/* nav */
nav{position:sticky;top:0;z-index:100;background:rgba(37,33,32,.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.07);padding:0}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:1.3rem;font-weight:800;color:var(--accent);letter-spacing:-.02em}
.nav-links{display:flex;gap:28px;list-style:none}
.nav-links a{font-size:.875rem;font-weight:500;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--text)}
/* hero */
.hero{position:relative;overflow:hidden;padding:80px 0 100px;background:var(--surface)}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 70% 50%,${pal.primary}28,transparent 70%)}
.hero-split{display:flex;align-items:center;gap:48px;position:relative}
.hero-content{flex:1;min-width:0}
.rating-badge{display:inline-flex;align-items:center;gap:8px;background:${pal.primary}22;border:1px solid ${pal.primary}44;border-radius:999px;padding:8px 18px;font-size:.82rem;font-weight:700;color:${pal.accent};margin-bottom:24px}
.hero-title{font-size:clamp(2.2rem,5vw,3.8rem);font-weight:800;line-height:1.05;letter-spacing:-.025em;margin-bottom:16px}
.hero-sub{font-size:1.05rem;color:var(--muted);margin-bottom:32px;max-width:460px;line-height:1.7}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
.btn-main{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:14px 28px;border-radius:14px;font-weight:700;font-size:.95rem;transition:opacity .2s}
.btn-main:hover{opacity:.88}
.btn-ghost-white{display:inline-flex;align-items:center;gap:8px;border:1.5px solid rgba(255,255,255,.2);color:var(--text);padding:14px 28px;border-radius:14px;font-weight:600;font-size:.95rem;transition:background .2s}
.btn-ghost-white:hover{background:rgba(255,255,255,.07)}
/* food visual */
.food-visual{flex-shrink:0;width:300px;height:300px;position:relative}
.food-blob{position:absolute;border-radius:50%}
/* category tabs */
.tabs-bar{background:var(--bg);padding:16px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.tabs-inner{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
.tab-pill{display:inline-block;padding:8px 20px;border-radius:999px;font-size:.85rem;font-weight:600;white-space:nowrap;cursor:pointer;border:1.5px solid rgba(255,255,255,.12);color:var(--muted);transition:all .2s}
.tab-pill.active,.tab-pill:hover{background:var(--primary);border-color:var(--primary);color:#fff}
/* features */
.features-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
.feat-card{background:var(--surface2);border:1px solid rgba(255,255,255,.07);border-radius:20px;padding:28px;transition:border-color .2s}
.feat-card:hover{border-color:${pal.primary}55}
.feat-icon{font-size:2rem;margin-bottom:16px}
.feat-title{font-size:1rem;font-weight:700;margin-bottom:8px}
.feat-desc{font-size:.875rem;color:var(--muted);line-height:1.6}
/* overrides for item cards dark */
.item-card{background:var(--surface2);border:1px solid rgba(255,255,255,.07)}
.item-name{color:var(--text)}
.item-price{color:var(--accent)!important}
/* overrides gallery dark */
.gallery-card{background:var(--surface2);border:1px solid rgba(255,255,255,.07)}
.gallery-name{color:var(--text)}
/* testimonials dark */
.testimonial-card{background:var(--surface2);border-color:rgba(255,255,255,.07)}
.testimonial-text{color:var(--text)}
.testimonial-name{color:var(--text)}
/* hours dark */
.hours-table tr{border-bottom:1px solid rgba(255,255,255,.07)}
.h-day,.h-val{color:var(--muted)}
/* about dark */
/* faq dark */
.faq-item{background:var(--surface2);border-color:${pal.primary}22}
.faq-q{color:var(--text)}
.faq-a{color:var(--muted)}
/* cta banner */
.cta-band{background:linear-gradient(135deg,${pal.primary},${pal.accent});padding:72px 0;text-align:center}
.cta-band h2{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;margin-bottom:12px;color:#fff}
.cta-band p{color:rgba(255,255,255,.82);margin-bottom:32px;font-size:1rem}
/* footer */
footer{background:var(--surface);border-top:1px solid rgba(255,255,255,.06);padding:48px 0}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.footer-logo{font-size:1.3rem;font-weight:800;color:var(--accent)}
.footer-sub{font-size:.85rem;color:var(--muted)}
</style>
${variation ? `<style>${STYLE_VARIATIONS.find(v => v.id === variation)?.css ?? ''}</style>` : ''}
</head>
<body>

${renderNav(variation ?? 'modern', name, [
  ...(mods.includes('servicos') ? [{ label: 'Cardápio', href: '#servicos' }] : []),
  ...(mods.includes('galeria') ? [{ label: 'Galeria', href: '#galeria' }] : []),
  ...(mods.includes('depoimentos') ? [{ label: 'Avaliações', href: '#depoimentos' }] : []),
  { label: 'Contato', href: '#contato' },
], pal, logoPreview)}

  ${renderHero({
  v: variation ?? 'modern',
  name,
  subheadline: ai?.hero_subheadline ?? 'Sabor autêntico e qualidade que você vai amar. Venha nos visitar ou peça pelo WhatsApp.',
  badge: '⭐ 4.8 — Mais de 200 avaliações',
  ctas: [
    ...(mods.includes('servicos') ? [{ label: 'Ver Cardápio', href: '#servicos', primary: true }] : []),
    ...(mods.includes('contato') ? [{ label: '📱 Pedir pelo WhatsApp', href: waLink }] : []),
  ],
  pal,
  industry: industryId,
  image: images?.hero,
})}

<div class="tabs-bar">
  <div class="container tabs-inner">
    ${['Todos', 'Pratos', 'Bebidas', 'Sobremesas', 'Combos'].map((t, i) => `<span class="tab-pill${i === 0 ? ' active' : ''}">${t}</span>`).join('')}
  </div>
</div>

${renderServices(variation ?? 'modern', services, pal, 'Qualidade em cada detalhe')}

${mods.includes('sobre') ? aboutSection(description, pal, ai) : ''}
${mods.includes('servicos') ? catalogSection(b.catalog_products, pal, true, industryId) : ''}
${mods.includes('contato') ? hoursSection(b.business_hours, waLink, pal) : ''}
${mods.includes('galeria') ? gallerySection(pal, true, industryId, images?.gallery) : ''}
${mods.includes('depoimentos') ? testimonialsSection(pal, true) : ''}
${mods.includes('faq') ? faqSection(pal, ai) : ''}

<section id="contato" class="cta-band">
  <div class="container">
    <h2>${ai?.cta_main ?? 'Peça agora pelo WhatsApp'}</h2>
    <p>${ai?.cta_sub ?? 'Atendimento rápido, entrega no prazo. Fale com a gente!'}</p>
    <a href="${waLink}" target="_blank" class="btn-wa-inline" style="margin:0 auto">
      ${WA_SVG} Falar pelo WhatsApp
    </a>
  </div>
</section>

<footer>
  <div class="container footer-inner">
    <span class="footer-logo">${name}</span>
    <span class="footer-sub">${b.domain ? `${b.domain}.com.br` : ''}</span>
    <span class="footer-sub" style="font-size:.78rem">${ai?.footer_tagline ?? 'Feito com SitePronto'}</span>
  </div>
</footer>

${mods.includes('contato') ? waFloat(waLink) : ''}
</body>
</html>`;
}

// ─── FARMACY / CLINIC TEMPLATE ────────────────────────────────────────────────
function generateFarmacy(b: SiteBriefing, pal: Palette, name: string, waLink: string, description: string, ai?: AICopy | null, variation?: StyleVariationId, industryId?: string, logoPreview?: string, images?: ImageSet): string {
  const mods = b.selected_modules ?? [];
  const industry = getIndustryById(industryId ?? 'generico');
  const services = ai?.services ?? industry?.fallbackServices ?? [
    { icon: '🩺', name: 'Equipe Especializada', description: 'Profissionais qualificados e atualizados com as melhores práticas do mercado.' },
    { icon: '📅', name: 'Agendamento Online', description: 'Marque sua consulta ou atendimento diretamente pelo WhatsApp, sem complicação.' },
    { icon: '💚', name: 'Atendimento Humano', description: 'Cada cliente é único. Atendimento personalizado com atenção e cuidado individual.' },
  ];
  const categories = ['💊 Medicamentos', '🌿 Natural', '💆 Bem-estar', '👶 Infantil'];
  const steps = [
    { n: '01', title: 'Entre em contato', desc: 'Fale conosco pelo WhatsApp ou venha pessoalmente.' },
    { n: '02', title: 'Avaliação', desc: 'Nossa equipe entende suas necessidades e recomenda o melhor.' },
    { n: '03', title: 'Solução completa', desc: 'Atendimento rápido com qualidade e preço justo.' },
  ];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<meta name="description" content="${(ai?.hero_subheadline ?? name).replace(/"/g, '&quot;')}" />
<meta property="og:title" content="${name.replace(/"/g, '&quot;')}" />
<meta property="og:description" content="${(ai?.hero_subheadline ?? name).replace(/"/g, '&quot;')}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="keywords" content="${(ai?.seo_keywords ?? [name]).join(', ')}" />
<meta name="robots" content="index,follow" />
<script type="application/ld+json">${(() => { const wa = b.whatsapp_number ?? '5511999999999'; const se = (ai?.hero_subheadline ?? name).replace(/"/g, '&quot;'); return JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name, description: se, url: `https://${b.domain || 'sitepronto.com.br'}`, telephone: wa, priceRange: '$' }); })()}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${fontLink(b.template)}" rel="stylesheet">
<style>
${BASE_CSS}
${fontCSS(b.template)}
:root{--primary:${pal.primary};--accent:${pal.accent};--light:${pal.light};--bg:#f7faf8;--surface:#ffffff;--surface2:#f0f4f2;--text:#0d1f1a;--muted:#5c7a6e}
body{background:var(--bg);color:var(--text)}
/* promo */
.promo-bar{background:linear-gradient(90deg,var(--primary),var(--accent));color:#fff;text-align:center;padding:10px 24px;font-size:.875rem;font-weight:600}
/* nav */
nav{background:#fff;border-bottom:1px solid rgba(0,0,0,.08);padding:0;position:sticky;top:0;z-index:100}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:1.2rem;font-weight:800;color:var(--primary)}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{font-size:.875rem;font-weight:500;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--text)}
/* hero */
.hero{padding:72px 0;background:linear-gradient(135deg,${pal.primary}18,${pal.accent}10);border-bottom:1px solid ${pal.primary}18}
.hero-split{display:flex;align-items:center;gap:48px}
.hero-content{flex:1}
.hero-badge{display:inline-block;background:${pal.primary}15;color:var(--primary);border-radius:999px;padding:6px 16px;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
.hero-title{font-size:clamp(1.9rem,4.5vw,3.2rem);font-weight:800;line-height:1.1;margin-bottom:16px}
.hero-sub{font-size:1rem;color:var(--muted);margin-bottom:32px;max-width:460px;line-height:1.7}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
.btn-main{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:14px 28px;border-radius:14px;font-weight:700;font-size:.95rem;transition:opacity .2s}
.btn-main:hover{opacity:.88}
.btn-outline{display:inline-flex;align-items:center;gap:8px;border:1.5px solid var(--primary);color:var(--primary);padding:14px 28px;border-radius:14px;font-weight:600;font-size:.95rem;transition:background .2s}
.btn-outline:hover{background:${pal.primary}08}
/* hero stats */
.hero-stats{display:flex;gap:32px;margin-top:36px;padding-top:32px;border-top:1px solid ${pal.primary}20}
.stat-n{font-size:1.6rem;font-weight:800;color:var(--primary)}
.stat-l{font-size:.78rem;color:var(--muted);margin-top:2px}
/* hero visual */
.hero-visual{flex-shrink:0;width:260px;height:260px;position:relative}
.h-blob{position:absolute;border-radius:50%}
/* trust strip */
.trust-strip{background:#fff;border-bottom:1px solid rgba(0,0,0,.07);padding:20px 0}
.trust-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;gap:24px}
.trust-item{display:flex;align-items:center;gap:8px;font-size:.85rem;font-weight:600;color:var(--text)}
.trust-icon{font-size:1.1rem}
/* features */
.feats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
.feat{background:#fff;border-radius:20px;padding:28px;border:1px solid rgba(0,0,0,.07);box-shadow:0 2px 12px rgba(0,0,0,.04);transition:box-shadow .2s}
.feat:hover{box-shadow:0 6px 24px rgba(0,0,0,.1)}
.feat-ico{font-size:1.8rem;margin-bottom:16px}
.feat-t{font-size:1rem;font-weight:700;margin-bottom:8px}
.feat-d{font-size:.875rem;color:var(--muted);line-height:1.6}
/* categories */
.cats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px}
.cat-card{background:#fff;border-radius:16px;padding:24px 16px;text-align:center;border:1px solid rgba(0,0,0,.07);transition:all .2s;cursor:default}
.cat-card:hover{border-color:var(--primary);box-shadow:0 4px 16px rgba(0,0,0,.08)}
.cat-ico{font-size:2rem;margin-bottom:10px}
.cat-name{font-size:.9rem;font-weight:700;color:var(--text)}
/* steps */
.steps-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px}
.step-card{text-align:center;padding:24px}
.step-num{font-size:2.4rem;font-weight:800;color:var(--primary);opacity:.15;margin-bottom:12px}
.step-t{font-size:1rem;font-weight:700;margin-bottom:8px}
.step-d{font-size:.875rem;color:var(--muted);line-height:1.6}
/* item cards light */
.item-card{background:#fff;border:1px solid rgba(0,0,0,.07);box-shadow:0 1px 8px rgba(0,0,0,.05)}
.item-name{color:var(--text)}
/* gallery light */
.gallery-card{background:#fff;border:1px solid rgba(0,0,0,.07)}
.gallery-name{color:var(--text)}
/* testimonial light */
.testimonial-card{background:#fff;border-color:rgba(0,0,0,.08)}
.testimonial-text{color:var(--muted)}
/* hours light */
.hours-table tr{border-bottom:1px solid rgba(0,0,0,.07)}
.h-day{color:var(--muted);font-weight:700}
.h-val{color:var(--text)}
/* faq */
.faq-item{background:#fff;border-color:${pal.primary}22}
.faq-q{color:var(--text)}
.faq-a{color:var(--muted)}
/* cta */
.cta-band{background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;padding:72px 0;text-align:center}
.cta-band h2{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;margin-bottom:12px}
.cta-band p{opacity:.85;margin-bottom:32px}
/* footer */
footer{background:var(--primary);color:rgba(255,255,255,.85);padding:48px 0}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.footer-logo{font-size:1.2rem;font-weight:800;color:#fff}
.footer-sub{font-size:.85rem;opacity:.7}
</style>
${variation ? `<style>${STYLE_VARIATIONS.find(v => v.id === variation)?.css ?? ''}</style>` : ''}
</head>
<body>

<div class="promo-bar">✨ Atendimento especializado — Agende agora pelo WhatsApp</div>

<div class="promo-bar">✨ Atendimento especializado — Agende agora pelo WhatsApp</div>

${renderNav(variation ?? 'modern', name, [
  ...(mods.includes('servicos') ? [{ label: 'Serviços', href: '#servicos' }] : []),
  ...(mods.includes('galeria') ? [{ label: 'Galeria', href: '#galeria' }] : []),
  ...(mods.includes('depoimentos') ? [{ label: 'Depoimentos', href: '#depoimentos' }] : []),
  { label: 'Contato', href: '#contato' },
], pal, logoPreview)}

  ${renderHero({
  v: variation ?? 'modern',
  name,
  subheadline: ai?.hero_subheadline ?? 'Cuidado especializado e atendimento humanizado. Sua saúde em boas mãos.',
  badge: '🏥 Saúde & Bem-estar',
  ctas: [
    ...(mods.includes('contato') ? [{ label: 'Agendar Consulta', href: '#contato', primary: true }] : []),
    ...(mods.includes('contato') ? [{ label: '📱 WhatsApp', href: waLink }] : []),
  ],
  stats: [
    { num: '98%', label: 'Satisfação' },
    { num: '10+', label: 'Anos' },
    { num: '5★', label: 'Avaliação' },
  ],
  pal,
  industry: industryId,
  image: images?.hero,
})}

<div class="trust-strip">
  <div class="container trust-row">
    ${['✅ Equipe certificada', '🔒 Atendimento sigiloso', '⚡ Resposta rápida', '💳 Diversas formas de pagamento'].map(t => `<span class="trust-item"><span>${t}</span></span>`).join('')}
  </div>
</div>

${renderServices(variation ?? 'modern', services, pal, `Por que escolher a ${name}?`)}

<section style="padding:64px 0;background:var(--surface2)">
  <div class="container">
    <div class="sec-hdr centered">
      <span class="eyebrow" style="color:${pal.primary}">Categorias</span>
      <h2 class="sec-title">O que oferecemos</h2>
    </div>
    <div class="cats-grid">
      ${categories.map(c => `
      <div class="cat-card">
        <div class="cat-ico">${c.split(' ')[0]}</div>
        <div class="cat-name">${c.split(' ').slice(1).join(' ')}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section style="padding:64px 0;background:var(--bg)">
  <div class="container">
    <div class="sec-hdr centered">
      <span class="eyebrow" style="color:${pal.primary}">Como funciona</span>
      <h2 class="sec-title">Simples e rápido</h2>
    </div>
    <div class="steps-row">
      ${steps.map(s => `
      <div class="step-card">
        <div class="step-num">${s.n}</div>
        <div class="step-t">${s.title}</div>
        <div class="step-d">${s.desc}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

${mods.includes('sobre') ? aboutSection(description, pal, ai) : ''}
${mods.includes('servicos') ? catalogSection(b.catalog_products, pal, false, industryId) : ''}
${mods.includes('contato') ? hoursSection(b.business_hours, waLink, pal) : ''}
${mods.includes('galeria') ? gallerySection(pal, false, industryId, images?.gallery) : ''}
${mods.includes('depoimentos') ? testimonialsSection(pal, false) : ''}
${mods.includes('faq') ? faqSection(pal, ai) : ''}

<section id="contato" class="cta-band">
  <div class="container">
    <h2>${ai?.cta_main ?? 'Pronto para cuidar de você?'}</h2>
    <p>${ai?.cta_sub ?? 'Agende agora pelo WhatsApp. Retornamos em instantes!'}</p>
    <a href="${waLink}" target="_blank" class="btn-wa-inline" style="margin:0 auto">
      ${WA_SVG} Agendar pelo WhatsApp
    </a>
  </div>
</section>

<footer>
  <div class="container footer-inner">
    <span class="footer-logo">${name}</span>
    <span class="footer-sub">${b.domain ? `${b.domain}.com.br` : ''}</span>
    <span class="footer-sub" style="font-size:.78rem">${ai?.footer_tagline ?? 'Feito com SitePronto'}</span>
  </div>
</footer>

${mods.includes('contato') ? waFloat(waLink) : ''}
</body>
</html>`;
}

// ─── STORE TEMPLATE ───────────────────────────────────────────────────────────
function generateStore(b: SiteBriefing, pal: Palette, name: string, waLink: string, description: string, ai?: AICopy | null, variation?: StyleVariationId, industryId?: string, logoPreview?: string, images?: ImageSet): string {
  const mods = b.selected_modules ?? [];
  const industry = getIndustryById(industryId ?? 'generico');
  const services = ai?.services ?? industry?.fallbackServices ?? [
    { icon: '🚚', name: 'Entrega Rápida', description: 'Envio ágil para todo o Brasil com rastreamento em tempo real.' },
    { icon: '✅', name: 'Qualidade Garantida', description: 'Produtos selecionados com procedência e qualidade comprovada.' },
    { icon: '💬', name: 'Suporte Direto', description: 'Atendimento pelo WhatsApp para dúvidas e pedidos especiais.' },
  ];
  const filters = ['Todos', 'Novidades', 'Mais Vendidos', 'Promoções'];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<meta name="description" content="${(ai?.hero_subheadline ?? name).replace(/"/g, '&quot;')}" />
<meta property="og:title" content="${name.replace(/"/g, '&quot;')}" />
<meta property="og:description" content="${(ai?.hero_subheadline ?? name).replace(/"/g, '&quot;')}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="keywords" content="${(ai?.seo_keywords ?? [name]).join(', ')}" />
<meta name="robots" content="index,follow" />
<script type="application/ld+json">${(() => { const wa = b.whatsapp_number ?? '5511999999999'; const se = (ai?.hero_subheadline ?? name).replace(/"/g, '&quot;'); return JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name, description: se, url: `https://${b.domain || 'sitepronto.com.br'}`, telephone: wa, priceRange: '$' }); })()}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${fontLink(b.template)}" rel="stylesheet">
<style>
${BASE_CSS}
${fontCSS(b.template)}
:root{--primary:${pal.primary};--accent:${pal.accent};--light:${pal.light};--bg:#ffffff;--surface:#f8fafc;--surface2:#f1f5f9;--text:#111827;--muted:#6b7280}
body{background:var(--bg);color:var(--text)}
/* nav */
nav{background:#fff;border-bottom:1px solid #e5e7eb;padding:0;position:sticky;top:0;z-index:100}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:1.3rem;font-weight:800;color:var(--text)}
.logo-dot{color:var(--accent)}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{font-size:.875rem;font-weight:500;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--text)}
.nav-icons{display:flex;align-items:center;gap:12px}
.nav-icon{width:36px;height:36px;border-radius:10px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer}
/* hero */
.hero{padding:72px 0;background:linear-gradient(135deg,${pal.light}88,${pal.accent}14);border-bottom:1px solid #e5e7eb;position:relative;overflow:hidden}
.hero::after{content:'';position:absolute;right:-60px;top:-60px;width:320px;height:320px;border-radius:50%;background:${pal.accent}12}
.hero-split{display:flex;align-items:center;gap:48px;position:relative}
.hero-content{flex:1}
.hero-tag{display:inline-block;background:${pal.primary}10;color:var(--primary);border-radius:999px;padding:6px 16px;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
.hero-title{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.08;margin-bottom:16px;letter-spacing:-.025em}
.hero-sub{font-size:1rem;color:var(--muted);margin-bottom:32px;max-width:460px;line-height:1.7}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
.btn-main{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:14px 28px;border-radius:12px;font-weight:700;font-size:.95rem;transition:opacity .2s}
.btn-main:hover{opacity:.88}
.btn-sec{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #e5e7eb;color:var(--text);padding:14px 28px;border-radius:12px;font-weight:600;font-size:.95rem;transition:background .2s}
.btn-sec:hover{background:var(--surface2)}
/* hero product visual */
.product-visual{flex-shrink:0;width:280px;height:280px;position:relative}
.prod-blob{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center}
/* filter bar */
.filter-bar{background:#fff;padding:16px 0;border-bottom:1px solid #e5e7eb}
.filter-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px}
.filter-pill{padding:8px 20px;border-radius:999px;font-size:.85rem;font-weight:600;border:1.5px solid #e5e7eb;color:var(--muted);cursor:pointer;white-space:nowrap;transition:all .2s;background:#fff}
.filter-pill.active,.filter-pill:hover{background:var(--primary);border-color:var(--primary);color:#fff}
/* features */
.feats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
.feat-card{padding:28px;border-radius:20px;background:#fff;border:1px solid #e5e7eb;transition:box-shadow .2s}
.feat-card:hover{box-shadow:0 6px 24px rgba(0,0,0,.08)}
.feat-ico{font-size:2rem;margin-bottom:16px}
.feat-t{font-size:1rem;font-weight:700;margin-bottom:8px}
.feat-d{font-size:.875rem;color:var(--muted);line-height:1.6}
/* items light */
.item-card{background:#fff;border:1px solid #e5e7eb;box-shadow:0 1px 6px rgba(0,0,0,.04)}
.item-name{color:var(--text)}
.item-price{color:var(--accent)!important}
/* gallery */
.gallery-card{background:#fff;border:1px solid #e5e7eb}
.gallery-name{color:var(--text)}
/* testimonials */
.testimonial-card{background:#fff;border-color:#e5e7eb}
.testimonial-text{color:var(--muted)}
/* hours */
.hours-table tr{border-bottom:1px solid #e5e7eb}
.h-day{color:var(--muted);font-weight:700}
.h-val{color:var(--text)}
/* faq */
.faq-item{background:#fff;border-color:${pal.primary}22}
.faq-q{color:var(--text)}
.faq-a{color:var(--muted)}
/* cta */
.cta-band{background:var(--primary);color:#fff;padding:72px 0;text-align:center}
.cta-band h2{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;margin-bottom:12px}
.cta-band p{opacity:.85;margin-bottom:32px}
/* newsletter */
.newsletter{display:flex;gap:8px;max-width:400px;margin:0 auto;margin-top:24px}
.newsletter input{flex:1;padding:12px 18px;border-radius:12px;border:none;font-size:.9rem}
.newsletter button{padding:12px 20px;border-radius:12px;background:var(--accent);color:#fff;font-weight:700;border:none;cursor:pointer}
/* footer */
footer{background:#111827;color:rgba(255,255,255,.75);padding:48px 0}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.footer-logo{font-size:1.2rem;font-weight:800;color:#fff}
.footer-sub{font-size:.85rem}
</style>
${variation ? `<style>${STYLE_VARIATIONS.find(v => v.id === variation)?.css ?? ''}</style>` : ''}
</head>
<body>

${renderNav(variation ?? 'modern', name, [
  ...(mods.includes('servicos') ? [{ label: 'Produtos', href: '#servicos' }] : []),
  ...(mods.includes('galeria') ? [{ label: 'Galeria', href: '#galeria' }] : []),
  { label: 'Contato', href: '#contato' },
], pal, logoPreview)}

${renderHero({
  v: variation ?? 'modern',
  name,
  subheadline: ai?.hero_subheadline ?? 'Os melhores produtos com qualidade garantida e entrega rápida. Compre com confiança.',
  badge: '🛍️ Loja Online',
  ctas: [
    ...(mods.includes('servicos') ? [{ label: 'Ver Produtos', href: '#servicos', primary: true }] : []),
    ...(mods.includes('contato') ? [{ label: '📱 Pedir pelo WhatsApp', href: waLink }] : []),
  ],
  pal,
  industry: industryId,
  image: images?.hero,
})}

<div class="filter-bar">
  <div class="container filter-row">
    ${filters.map((f, i) => `<span class="filter-pill${i === 0 ? ' active' : ''}">${f}</span>`).join('')}
  </div>
</div>

${renderServices(variation ?? 'modern', services, pal, 'Nossos diferenciais')}

${mods.includes('sobre') ? aboutSection(description, pal, ai) : ''}
${mods.includes('servicos') ? catalogSection(b.catalog_products, pal, false, industryId) : ''}
${mods.includes('contato') ? hoursSection(b.business_hours, waLink, pal) : ''}
${mods.includes('galeria') ? gallerySection(pal, false, industryId, images?.gallery) : ''}
${mods.includes('depoimentos') ? testimonialsSection(pal, false) : ''}
${mods.includes('faq') ? faqSection(pal, ai) : ''}

<section id="contato" class="cta-band">
  <div class="container">
    <h2>${ai?.cta_main ?? 'Quer fazer um pedido especial?'}</h2>
    <p>${ai?.cta_sub ?? 'Fale diretamente com a gente pelo WhatsApp.'}</p>
    <a href="${waLink}" target="_blank" class="btn-wa-inline" style="margin:0 auto">
      ${WA_SVG} Falar pelo WhatsApp
    </a>
    <div class="newsletter">
      <input type="email" placeholder="Seu melhor e-mail" />
      <button>Assinar</button>
    </div>
  </div>
</section>

<footer>
  <div class="container footer-inner">
    <span class="footer-logo">${name}</span>
    <span class="footer-sub">${b.domain ? `${b.domain}.com.br` : ''} · ${ai?.footer_tagline ?? 'Feito com SitePronto'}</span>
  </div>
</footer>

${mods.includes('contato') ? waFloat(waLink) : ''}
</body>
</html>`;
}

// ─── PORTFOLIO TEMPLATE ───────────────────────────────────────────────────────
function generatePortfolio(b: SiteBriefing, pal: Palette, name: string, waLink: string, description: string, ai?: AICopy | null, variation?: StyleVariationId, industryId?: string, logoPreview?: string, images?: ImageSet): string {
  const mods = b.selected_modules ?? [];
  const industry = getIndustryById(industryId ?? 'generico');
  const services = ai?.services ?? industry?.fallbackServices ?? [
    { icon: '🎯', name: 'Consultoria Estratégica', description: 'Análise completa do seu negócio com recomendações práticas para crescimento.' },
    { icon: '📊', name: 'Análise e Resultados', description: 'Métricas e relatórios detalhados para decisões baseadas em dados reais.' },
    { icon: '🚀', name: 'Execução e Entrega', description: 'Implementação ágil com foco em resultado e prazo definido.' },
  ];
  const skills = ['Estratégia', 'Design', 'Tecnologia', 'Marketing', 'Gestão'];
  const skillWidths = [92, 88, 82, 75, 90];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<meta name="description" content="${(ai?.hero_subheadline ?? name).replace(/"/g, '&quot;')}" />
<meta property="og:title" content="${name.replace(/"/g, '&quot;')}" />
<meta property="og:description" content="${(ai?.hero_subheadline ?? name).replace(/"/g, '&quot;')}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="keywords" content="${(ai?.seo_keywords ?? [name]).join(', ')}" />
<meta name="robots" content="index,follow" />
<script type="application/ld+json">${(() => { const wa = b.whatsapp_number ?? '5511999999999'; const se = (ai?.hero_subheadline ?? name).replace(/"/g, '&quot;'); return JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name, description: se, url: `https://${b.domain || 'sitepronto.com.br'}`, telephone: wa, priceRange: '$' }); })()}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${fontLink(b.template)}" rel="stylesheet">
<style>
${BASE_CSS}
${fontCSS(b.template)}
:root{--primary:${pal.primary};--accent:${pal.accent};--light:${pal.light};--bg:#0f172a;--surface:#1e293b;--surface2:#0f172a;--text:#f8fafc;--muted:#94a3b8}
body{background:var(--bg);color:var(--text)}
/* nav */
nav{background:rgba(15,23,42,.92);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.06);padding:0;position:sticky;top:0;z-index:100}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:1.2rem;font-weight:800;letter-spacing:-.02em}
.logo-dot{color:var(--primary)}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{font-size:.875rem;font-weight:500;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--text)}
/* hero */
.hero{min-height:88vh;display:flex;align-items:center;position:relative;overflow:hidden;padding:80px 0}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 70% 30%,${pal.primary}2a,transparent 65%)}
.hero-split{display:flex;align-items:center;gap:64px;position:relative;width:100%}
.hero-content{flex:1}
.hello-tag{display:inline-flex;align-items:center;gap:8px;background:${pal.primary}20;border:1px solid ${pal.primary}40;border-radius:999px;padding:8px 18px;font-size:.82rem;font-weight:700;color:var(--primary);margin-bottom:24px}
.hero-title{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;line-height:1.02;letter-spacing:-.03em;margin-bottom:16px}
.hero-role{font-size:1.1rem;color:${pal.accent};font-weight:600;margin-bottom:16px}
.hero-sub{font-size:1rem;color:var(--muted);margin-bottom:36px;max-width:520px;line-height:1.7}
.hero-ctas{display:flex;gap:14px;flex-wrap:wrap}
.btn-primary-full{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:15px 32px;border-radius:14px;font-weight:700;font-size:.95rem;transition:opacity .2s}
.btn-primary-full:hover{opacity:.88}
.btn-ghost-dark{display:inline-flex;align-items:center;gap:8px;border:1.5px solid rgba(255,255,255,.18);color:var(--text);padding:15px 32px;border-radius:14px;font-weight:600;font-size:.95rem;transition:background .2s}
.btn-ghost-dark:hover{background:rgba(255,255,255,.06)}
/* stats */
.stats-row{display:flex;gap:32px;flex-wrap:wrap;margin-top:44px;padding-top:40px;border-top:1px solid rgba(255,255,255,.08)}
.stat-n{font-size:1.8rem;font-weight:800;color:var(--primary)}
.stat-l{font-size:.8rem;color:var(--muted);margin-top:4px}
/* avatar */
.avatar-wrap{flex-shrink:0;width:280px;height:280px;position:relative}
.avatar-circle{width:260px;height:260px;border-radius:50%;background:linear-gradient(135deg,${pal.primary}44,${pal.accent}33);display:flex;align-items:center;justify-content:center;font-size:6rem;border:3px solid ${pal.primary}33;position:absolute;top:10px;left:10px}
.avatar-badge{position:absolute;bottom:10px;right:-10px;background:var(--surface);border:2px solid ${pal.primary}44;border-radius:16px;padding:12px 16px}
.badge-val{font-size:1.2rem;font-weight:800;color:var(--primary);display:block}
.badge-lbl{font-size:.72rem;color:var(--muted)}
/* services */
.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}
.service-card{background:var(--surface);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:32px;transition:all .2s}
.service-card:hover{border-color:${pal.primary}55;transform:translateY(-4px)}
.svc-icon{width:52px;height:52px;border-radius:16px;background:${pal.primary}20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:20px}
.svc-title{font-size:1rem;font-weight:700;margin-bottom:10px}
.svc-desc{font-size:.875rem;color:var(--muted);line-height:1.7}
/* skills */
.skills-list{display:flex;flex-direction:column;gap:16px;max-width:700px}
.skill-row{display:flex;align-items:center;gap:16px}
.skill-name{min-width:120px;font-size:.9rem;font-weight:600;color:var(--muted)}
.skill-track{flex:1;height:6px;background:var(--surface);border-radius:3px;overflow:hidden}
.skill-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--primary),var(--accent))}
.skill-pct{font-size:.8rem;font-weight:700;color:var(--primary);min-width:40px;text-align:right}
/* project grid */
.project-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.project-card{background:var(--surface);border:1px solid rgba(255,255,255,.07);border-radius:20px;overflow:hidden;transition:transform .2s}
.project-card:hover{transform:translateY(-4px)}
.project-thumb{height:200px;display:flex;align-items:center;justify-content:center;position:relative}
.project-body{padding:20px}
.project-tag{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--primary)}
.project-name{font-size:1rem;font-weight:700;margin-top:6px}
.project-year{font-size:.8rem;color:var(--muted);margin-top:4px}
/* testimonials dark overrides */
.testimonial-card{background:var(--surface);border-color:rgba(255,255,255,.07)}
.testimonial-text{color:var(--text)}
.testimonial-name{color:var(--text)}
/* gallery dark */
.gallery-card{background:var(--surface);border:1px solid rgba(255,255,255,.07)}
.gallery-name{color:var(--text)}
/* hours dark */
.hours-table tr{border-bottom:1px solid rgba(255,255,255,.07)}
.h-day,.h-val{color:var(--muted)}
/* faq dark */
.faq-item{background:var(--surface);border-color:rgba(255,255,255,.07)}
.faq-q{color:var(--text)}
.faq-a{color:var(--muted)}
/* items dark */
.item-card{background:var(--surface);border:1px solid rgba(255,255,255,.07)}
.item-name{color:var(--text)}
/* cta section */
.cta-section{padding:96px 0;text-align:center;position:relative;overflow:hidden}
.cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 50% 50%,${pal.primary}28,transparent 70%)}
.cta-section .container{position:relative}
.cta-title{font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:800;margin-bottom:16px}
.cta-sub{color:var(--muted);margin-bottom:36px}
.contact-card{background:var(--surface);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:40px;max-width:440px;margin:0 auto}
.contact-info{display:flex;flex-direction:column;gap:12px;margin-bottom:24px;text-align:left}
.contact-row{display:flex;align-items:center;gap:12px;font-size:.9rem;color:var(--muted)}
.contact-ico{font-size:1.1rem}
/* footer */
footer{border-top:1px solid rgba(255,255,255,.06);padding:48px 0}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.footer-logo{font-size:1.3rem;font-weight:800}
.footer-dot{color:var(--primary)}
.footer-sub{font-size:.85rem;color:var(--muted)}
</style>
${variation ? `<style>${STYLE_VARIATIONS.find(v => v.id === variation)?.css ?? ''}</style>` : ''}
</head>
<body>

${renderNav(variation ?? 'modern', name, [
  { label: 'Serviços', href: '#servicos' },
  ...(mods.includes('galeria') ? [{ label: 'Portfólio', href: '#galeria' }] : []),
  ...(mods.includes('depoimentos') ? [{ label: 'Depoimentos', href: '#depoimentos' }] : []),
  { label: 'Contato', href: '#contato' },
], pal, logoPreview)}

${renderHero({
  v: variation ?? 'modern',
  name,
  subheadline: ai?.hero_subheadline ?? 'Soluções profissionais com resultados comprovados. Transformamos desafios em oportunidades de crescimento.',
  badge: `👋 Olá, somos a ${name}`,
  ctas: [
    { label: 'Fale Conosco', href: '#contato', primary: true },
    ...(mods.includes('galeria') ? [{ label: 'Ver Portfólio', href: '#galeria' }] : []),
  ],
  stats: [
    { num: '+50', label: 'Projetos' },
    { num: '5★', label: 'Avaliação' },
    { num: '8', label: 'Anos' },
    { num: '100%', label: 'Entrega' },
  ],
  pal,
  industry: industryId,
  image: images?.hero,
})}

${renderServices(variation ?? 'modern', services, pal, 'Nossos Serviços')}

<section style="padding:80px 0;background:var(--bg)">
  <div class="container">
    <div class="sec-hdr">
      <span class="eyebrow" style="color:${pal.primary}">Competências</span>
      <h2 class="sec-title">Nossas especialidades</h2>
    </div>
    <div class="skills-list">
      ${skills.map((s, i) => `
      <div class="skill-row">
        <span class="skill-name">${s}</span>
        <div class="skill-track"><div class="skill-fill" style="width:${skillWidths[i]}%"></div></div>
        <span class="skill-pct">${skillWidths[i]}%</span>
      </div>`).join('')}
    </div>
  </div>
</section>

${mods.includes('sobre') ? aboutSection(description, pal, ai) : ''}

${mods.includes('galeria') ? `
<section id="galeria" style="padding:80px 0;background:var(--surface)">
  <div class="container">
    <div class="sec-hdr">
      <span class="eyebrow" style="color:${pal.primary}">Portfólio</span>
      <h2 class="sec-title">Projetos recentes</h2>
    </div>
    <div class="project-grid">
      ${[
        ['Branding Digital', 'Design', '2024'],
        ['E-commerce B2C', 'Desenvolvimento', '2024'],
        ['Estratégia de Marketing', 'Consultoria', '2023'],
        ['App Mobile', 'Tecnologia', '2023'],
        ['Identidade Visual', 'Design', '2024'],
        ['Gestão de Projetos', 'Consultoria', '2023'],
      ].map(([pname, tag, year], i) => {
        const cols = [pal.primary, pal.accent, `${pal.primary}88`, `${pal.accent}88`];
        const realImg = images?.gallery?.[i % (images.gallery.length || 1)];
        return `
      <div class="project-card">
        <div class="project-thumb" style="background:linear-gradient(135deg,${cols[i%4]}33,${cols[(i+1)%4]}22)">
          ${realImg
            ? `<img src="${realImg}" alt="${pname}" style="width:100%;height:100%;object-fit:cover;display:block" referrerpolicy="no-referrer">`
            : `<div style="width:80px;height:80px;border-radius:50%;background:${cols[i%4]}55;display:flex;align-items:center;justify-content:center;font-size:2rem">✦</div>`}
        </div>
        <div class="project-body">
          <span class="project-tag">${tag}</span>
          <div class="project-name">${pname}</div>
          <div class="project-year">${year}</div>
        </div>
      </div>`;
      }).join('')}
    </div>
  </div>
</section>` : ''}

${mods.includes('contato') ? hoursSection(b.business_hours, waLink, pal) : ''}
${mods.includes('depoimentos') ? testimonialsSection(pal, true) : ''}
${mods.includes('faq') ? faqSection(pal, ai) : ''}

<section id="contato" class="cta-section">
  <div class="container">
    <h2 class="cta-title">${ai?.cta_main ?? 'Pronto para começar?'}</h2>
    <p class="cta-sub">${ai?.cta_sub ?? 'Entre em contato hoje e vamos transformar seu negócio juntos.'}</p>
    <div class="contact-card">
      <div class="contact-info">
        <div class="contact-row"><span class="contact-ico">📱</span> WhatsApp direto e rápido</div>
        <div class="contact-row"><span class="contact-ico">⏱️</span> Resposta em até 24h</div>
        <div class="contact-row"><span class="contact-ico">🌎</span> Atendemos todo o Brasil</div>
      </div>
      <a href="${waLink}" target="_blank" class="btn-wa-inline" style="width:100%;justify-content:center">
        ${WA_SVG} Falar pelo WhatsApp
      </a>
    </div>
  </div>
</section>

<footer>
  <div class="container footer-inner">
    <span class="footer-logo">${name}<span class="footer-dot">.</span></span>
    <span class="footer-sub">${b.domain ? `${b.domain}.com.br` : ''} · ${ai?.footer_tagline ?? 'Feito com SitePronto'}</span>
  </div>
</footer>

${mods.includes('contato') ? waFloat(waLink) : ''}
</body>
</html>`;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
export function generateSiteHTML(briefing: SiteBriefing, variation?: StyleVariationId): string {
  const pal = PALETTES[briefing.palette] ?? PALETTES['azul-editorial'];
  const { businessName, description, ai, logoPreview, dynamicIndustry, images } = parseAICopyFromNotes(briefing.content_notes);

  // Industry: briefing.segment (set from detectIndustry at save time) takes priority.
  // Falls back to keyword detection from name+description as a safety net.
  const segmentIndustry = getIndustryById(briefing.segment);
  const keywordIndustry = detectIndustry(businessName || '', description || '');
  const industry = (segmentIndustry && segmentIndustry.id !== 'generico')
    ? segmentIndustry
    : keywordIndustry;

  // Validate AI content against the detected industry.
  // If AI content is missing or mismatched, fall back to industry-specific copy.
  // effectiveAI is NEVER null — templates always receive appropriate content.
  const aiContentValid = ai != null && validateAIContent(ai, industry);

  // For unknown segments: use dynamicIndustry (AI-researched at save time) as rich fallback
  const fallbackSource = (industry.id === 'generico' && dynamicIndustry) ? dynamicIndustry : industry;

  const effectiveAI: AICopy = aiContentValid
    ? ai!
    : {
        hero_subheadline: fallbackSource.fallbackHeadline,
        cta_main: fallbackSource.fallbackCTA,
        cta_sub: fallbackSource.fallbackCTASub,
        services: fallbackSource.fallbackServices,
        footer_tagline: fallbackSource.fallbackTagline,
        image_prompts: {
          hero: fallbackSource.imagePrompt,
          gallery: (fallbackSource as typeof industry).galleryPrompts ?? [fallbackSource.imagePrompt],
          catalog: fallbackSource.imagePrompt,
        },
        seo_keywords: [businessName || '', fallbackSource.label],
      };

  const name = businessName || formatBusinessName(briefing.domain, briefing.segment);
  const waLink = whatsappLink(briefing.whatsapp_number);
  // For unknown segments, use the AI-researched template if available
  const tpl = briefing.template && briefing.template !== 'portfolio'
    ? briefing.template
    : (industry.id === 'generico' && dynamicIndustry ? dynamicIndustry.template : briefing.template) || 'portfolio';
  const industryId = industry.id;

  if (tpl === 'restaurant') return generateRestaurant(briefing, pal, name, waLink, description, effectiveAI, variation, industryId, logoPreview, images ?? undefined);
  if (tpl === 'farmacy')    return generateFarmacy(briefing, pal, name, waLink, description, effectiveAI, variation, industryId, logoPreview, images ?? undefined);
  if (tpl === 'store')      return generateStore(briefing, pal, name, waLink, description, effectiveAI, variation, industryId, logoPreview, images ?? undefined);
  return generatePortfolio(briefing, pal, name, waLink, description, effectiveAI, variation, industryId, logoPreview, images ?? undefined);
}

export function generateReadme(briefing: SiteBriefing): string {
  const name = formatBusinessName(briefing.domain, briefing.segment);
  const domain = briefing.domain ? `${briefing.domain}.com.br` : 'seu-dominio.com.br';
  return `SitePronto — ${name}
${'='.repeat(50)}

COMO SUBIR NO FTP
-----------------
1. Conecte no seu FTP (host, usuário e senha do seu servidor)
2. Navegue até a pasta raiz do domínio (geralmente public_html/)
3. Faça upload do arquivo index.html e da pasta assets/ (se houver)
4. Acesse ${domain} no navegador para confirmar

HOSPEDAGEM RECOMENDADA (Brasil)
--------------------------------
• Hostgator, Locaweb, KingHost, Hostinger, UOL Host
• Qualquer hospedagem compartilhada com suporte a HTML estático

PERSONALIZAÇÕES POSSÍVEIS
--------------------------
Abra o index.html em qualquer editor de texto para editar:
• Textos e títulos
• Cores (procure por --primary e --accent no CSS)
• Imagens (substitua as divs por tags <img>)

INFORMAÇÕES DO PEDIDO
-----------------------
ID: ${briefing.id}
Segmento: ${briefing.segment}
Template: ${briefing.template}
Paleta: ${briefing.palette}
Domínio: ${domain}
Gerado em: ${new Date().toLocaleString('pt-BR')}

Dúvidas? Acesse sitepronto.com.br ou responda o e-mail de confirmação.`;
}
