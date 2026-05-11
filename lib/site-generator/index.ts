import { parseAICopyFromNotes, type AICopy } from '@/lib/ai-copy';

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
  // Legacy IDs
  'azul-editorial': { primary: '#004ac6', accent: '#2563eb', light: '#dbe6ff', dark: '#001d4a' },
  'verde-servico':  { primary: '#0f766e', accent: '#14b8a6', light: '#ccfbf1', dark: '#042f2e' },
  'vinho-premium':  { primary: '#7f1d1d', accent: '#be123c', light: '#ffe4e6', dark: '#3b0000' },
  // New palette IDs
  'minimal':    { primary: '#374151', accent: '#6b7280', light: '#f3f4f6', dark: '#111827' },
  'vibrant':    { primary: '#004ac6', accent: '#eab308', light: '#fef9c3', dark: '#001d4a' },
  'corporate':  { primary: '#002855', accent: '#004ac6', light: '#dbe1ff', dark: '#001029' },
  'nature':     { primary: '#059669', accent: '#f97316', light: '#d1fae5', dark: '#022c22' },
  'tech':       { primary: '#111827', accent: '#06b6d4', light: '#cffafe', dark: '#030712' },
  'elegant':    { primary: '#2b1b17', accent: '#b58e58', light: '#f5f1ed', dark: '#0f0805' },
};

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

function catalogSection(products: SiteBriefing['catalog_products'], pal: Palette): string {
  if (!products || products.length === 0) return '';
  const cards = products.map((p) => {
    const img = p.imagePreview
      ? `<img src="${p.imagePreview}" alt="${p.name}" class="prod-img" />`
      : `<div class="prod-img-placeholder"></div>`;
    return `
      <div class="prod-card">
        ${img}
        <div class="prod-info">
          <span class="prod-name">${p.name || 'Produto'}</span>
          ${p.price ? `<span class="prod-price">${p.price}</span>` : ''}
        </div>
      </div>`;
  }).join('');
  return `
  <section id="catalogo" class="section">
    <div class="container">
      <div class="section-header">
        <span class="eyebrow" style="color:${pal.primary}">Catálogo</span>
        <h2 class="section-title">Nossos produtos e serviços</h2>
      </div>
      <div class="prod-grid">${cards}</div>
    </div>
  </section>`;
}

function hoursSection(hours: string | null, waLink: string, pal: Palette): string {
  if (!hours) return '';
  const hoursHtml = hours.split('\n').map((line) => `<p>${line}</p>`).join('');
  return `
  <section id="agendamento" class="section section-alt">
    <div class="container">
      <div class="section-header">
        <span class="eyebrow" style="color:${pal.primary}">Agendamento</span>
        <h2 class="section-title">Horários de atendimento</h2>
      </div>
      <div class="hours-box">
        <div class="hours-text">${hoursHtml}</div>
        <a href="${waLink}?text=Olá!%20Gostaria%20de%20agendar%20um%20horário." target="_blank" class="btn-wa">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.857L0 24l6.335-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-5.007-1.374l-.36-.213-3.724.882.93-3.618-.234-.372A9.794 9.794 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
          Agendar pelo WhatsApp
        </a>
      </div>
    </div>
  </section>`;
}

function portfolioSection(pal: Palette): string {
  return `
  <section id="portfolio" class="section">
    <div class="container">
      <div class="section-header">
        <span class="eyebrow" style="color:${pal.primary}">Portfólio</span>
        <h2 class="section-title">Nossos trabalhos</h2>
        <p class="section-sub">Conheça alguns projetos que realizamos para nossos clientes.</p>
      </div>
      <div class="portfolio-grid">
        ${[1,2,3,4].map((i) => `
          <div class="portfolio-card">
            <div class="portfolio-thumb" style="background:linear-gradient(135deg,${pal.light},${pal.accent}22)"></div>
            <div class="portfolio-info">
              <span class="portfolio-tag" style="color:${pal.primary}">Projeto ${i}</span>
              <p class="portfolio-desc">Descrição do projeto e resultado alcançado para o cliente.</p>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function blogSection(pal: Palette): string {
  return `
  <section id="blog" class="section section-alt">
    <div class="container">
      <div class="section-header">
        <span class="eyebrow" style="color:${pal.primary}">Blog</span>
        <h2 class="section-title">Artigos e novidades</h2>
      </div>
      <div class="blog-grid">
        ${['Primeiro artigo do blog', 'Dicas e novidades', 'Saiba mais sobre nós'].map((title) => `
          <div class="blog-card">
            <div class="blog-thumb" style="background:${pal.light}"></div>
            <div class="blog-body">
              <span class="blog-cat" style="color:${pal.primary}">Novidade</span>
              <h3 class="blog-title">${title}</h3>
              <p class="blog-excerpt">Em breve novos conteúdos por aqui. Fique ligado!</p>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function waFloat(waLink: string): string {
  return `
  <a href="${waLink}" target="_blank" class="wa-float" aria-label="Falar pelo WhatsApp">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.857L0 24l6.335-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-5.007-1.374l-.36-.213-3.724.882.93-3.618-.234-.372A9.794 9.794 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
  </a>`;
}

// ─── RESTAURANT TEMPLATE ──────────────────────────────────────────────────────
function generateRestaurant(b: SiteBriefing, pal: Palette, name: string, waLink: string, ai?: AICopy | null): string {
  const mods = b.selected_modules ?? [];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:${pal.primary};--accent:${pal.accent};--light:${pal.light};--bg:#1c1917;--surface:#292524;--surface2:#3c3836;--text:#fafaf9;--muted:#a8a29e}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:1100px;margin:0 auto;padding:0 24px}
/* NAV */
nav{position:sticky;top:0;z-index:100;background:var(--surface);border-bottom:1px solid rgba(255,255,255,0.08);padding:16px 0}
.nav-inner{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:1.25rem;font-weight:800;color:var(--accent)}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{font-size:.875rem;font-weight:500;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--text)}
/* HERO */
.hero{background:linear-gradient(135deg,var(--surface) 0%,#0c0a09 100%);padding:80px 0;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 60% 40%,${pal.primary}22,transparent 70%)}
.hero-inner{position:relative;display:flex;gap:48px;align-items:center}
.hero-content{flex:1}
.hero-tag{display:inline-block;background:${pal.primary}22;color:var(--accent);border:1px solid ${pal.primary}44;border-radius:999px;padding:6px 16px;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
.hero-title{font-size:clamp(2.2rem,5vw,3.5rem);font-weight:800;line-height:1.1;margin-bottom:16px}
.hero-sub{font-size:1.1rem;color:var(--muted);margin-bottom:32px;max-width:480px}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:14px 28px;border-radius:14px;font-weight:700;font-size:.95rem;transition:opacity .2s}
.btn-primary:hover{opacity:.88}
.btn-outline{display:inline-flex;align-items:center;gap:8px;border:1.5px solid rgba(255,255,255,0.25);color:var(--text);padding:14px 28px;border-radius:14px;font-weight:600;font-size:.95rem;transition:background .2s}
.btn-outline:hover{background:rgba(255,255,255,0.06)}
.hero-badge{display:flex;gap:20px;margin-top:32px}
.badge-item{font-size:.8rem;color:var(--muted);display:flex;align-items:center;gap:6px}
/* SECTION */
.section{padding:80px 0}
.section-alt{background:var(--surface)}
.section-header{text-align:center;margin-bottom:48px}
.eyebrow{font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.section-title{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:800;margin-top:8px}
.section-sub{color:var(--muted);margin-top:10px;font-size:1rem}
/* FEATURES */
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}
.feature-card{background:var(--surface);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:28px;transition:border-color .2s}
.feature-card:hover{border-color:${pal.primary}55}
.feature-icon{width:48px;height:48px;border-radius:14px;background:${pal.primary}22;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:1.5rem}
.feature-title{font-size:1rem;font-weight:700;margin-bottom:8px}
.feature-desc{font-size:.875rem;color:var(--muted);line-height:1.6}
/* PRODUCTS */
.prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px}
.prod-card{background:var(--surface);border:1px solid rgba(255,255,255,0.07);border-radius:20px;overflow:hidden;transition:transform .2s}
.prod-card:hover{transform:translateY(-4px)}
.prod-img{width:100%;height:160px;object-fit:cover}
.prod-img-placeholder{width:100%;height:160px;background:var(--surface2)}
.prod-info{padding:16px}
.prod-name{display:block;font-size:.95rem;font-weight:700;margin-bottom:6px}
.prod-price{display:inline-block;color:var(--accent);font-weight:700;font-size:1rem}
/* HOURS */
.hours-box{max-width:500px;margin:0 auto;background:var(--surface);border-radius:20px;padding:32px;text-align:center}
.hours-text p{color:var(--muted);margin-bottom:8px;font-size:.95rem}
.btn-wa{display:inline-flex;align-items:center;gap:10px;background:#16a34a;color:#fff;padding:14px 28px;border-radius:14px;font-weight:700;font-size:.95rem;margin-top:24px;transition:opacity .2s}
.btn-wa:hover{opacity:.88}
/* PORTFOLIO */
.portfolio-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:24px}
.portfolio-card{background:var(--surface);border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.07)}
.portfolio-thumb{height:160px}
.portfolio-info{padding:20px}
.portfolio-tag{font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.portfolio-desc{font-size:.875rem;color:var(--muted);margin-top:8px}
/* BLOG */
.blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}
.blog-card{background:var(--surface);border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.07)}
.blog-thumb{height:140px}
.blog-body{padding:20px}
.blog-cat{font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.blog-title{font-size:1rem;font-weight:700;margin-top:8px}
.blog-excerpt{font-size:.875rem;color:var(--muted);margin-top:8px}
/* CTA BANNER */
.cta-banner{background:linear-gradient(135deg,var(--primary),${pal.accent});padding:64px 0;text-align:center}
.cta-banner h2{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:800;margin-bottom:12px}
.cta-banner p{color:rgba(255,255,255,.8);margin-bottom:28px;font-size:1rem}
/* FOOTER */
footer{background:var(--surface);border-top:1px solid rgba(255,255,255,.06);padding:40px 0}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}
.footer-logo{font-size:1.2rem;font-weight:800;color:var(--accent)}
.footer-domain{font-size:.875rem;color:var(--muted)}
/* WA FLOAT */
.wa-float{position:fixed;bottom:24px;right:24px;z-index:999;width:56px;height:56px;border-radius:50%;background:#16a34a;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(22,163,74,.5);transition:transform .2s}
.wa-float:hover{transform:scale(1.1)}
@media(max-width:768px){
  .hero-inner{flex-direction:column}
  .nav-links{display:none}
}
</style>
</head>
<body>

<nav>
  <div class="container nav-inner">
    <span class="logo">${name}</span>
    <ul class="nav-links">
      ${mods.includes('catalogo') ? '<li><a href="#catalogo">Cardápio</a></li>' : ''}
      ${mods.includes('agendamento') ? '<li><a href="#agendamento">Horários</a></li>' : ''}
      ${mods.includes('portfolio') ? '<li><a href="#portfolio">Portfólio</a></li>' : ''}
      ${mods.includes('blog') ? '<li><a href="#blog">Blog</a></li>' : ''}
      <li><a href="#contato">Contato</a></li>
    </ul>
  </div>
</nav>

<section class="hero">
  <div class="container hero-inner">
    <div class="hero-content">
      <div class="hero-tag">🍽️ Bem-vindo</div>
      <h1 class="hero-title">${name}</h1>
      <p class="hero-sub">${ai?.hero_subheadline ?? 'Sabor e qualidade que você vai amar. Venha nos visitar ou peça pelo WhatsApp.'}</p>
      <div class="hero-ctas">
        ${mods.includes('catalogo') ? `<a href="#catalogo" class="btn-primary">Ver Cardápio</a>` : ''}
        ${mods.includes('whatsapp') ? `<a href="${waLink}" target="_blank" class="btn-outline">📱 WhatsApp</a>` : ''}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow" style="color:${pal.primary}">Por que nos escolher</span>
      <h2 class="section-title">Qualidade em cada detalhe</h2>
    </div>
    <div class="features-grid">
      ${(ai?.services ?? [
        {icon:'🌟',name:'Qualidade Premium',description:'Ingredientes selecionados e preparo artesanal em cada prato.'},
        {icon:'🚀',name:'Atendimento Ágil',description:'Pedidos rápidos pelo WhatsApp, sem espera desnecessária.'},
        {icon:'❤️',name:'Feito com Amor',description:'Receitas exclusivas preparadas com dedicação e carinho.'},
      ]).map(s=>`<div class="feature-card"><div class="feature-icon">${s.icon}</div><div class="feature-title">${s.name}</div><div class="feature-desc">${s.description}</div></div>`).join('')}
    </div>
  </div>
</section>

${mods.includes('catalogo') ? catalogSection(b.catalog_products, pal) : ''}
${mods.includes('agendamento') ? hoursSection(b.business_hours, waLink, pal) : ''}
${mods.includes('portfolio') ? portfolioSection(pal) : ''}
${mods.includes('blog') ? blogSection(pal) : ''}

<section id="contato" class="cta-banner">
  <div class="container">
    <h2>${ai?.cta_main ?? 'Fale com a gente'}</h2>
    <p>${ai?.cta_sub ?? 'Tire suas dúvidas ou faça seu pedido diretamente pelo WhatsApp.'}</p>
    <a href="${waLink}" target="_blank" class="btn-wa" style="margin:0 auto">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.857L0 24l6.335-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-5.007-1.374l-.36-.213-3.724.882.93-3.618-.234-.372A9.794 9.794 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
      Falar pelo WhatsApp
    </a>
  </div>
</section>

<footer>
  <div class="container footer-inner">
    <span class="footer-logo">${name}</span>
    <span class="footer-domain">${b.domain ? `${b.domain}.com.br` : 'siteprontodemo.com.br'}</span>
    <span class="footer-domain" style="font-size:.75rem">${ai?.footer_tagline ?? 'Feito com SitePronto'}</span>
  </div>
</footer>

${mods.includes('whatsapp') ? waFloat(waLink) : ''}
</body>
</html>`;
}

// ─── FARMACY / CLINIC TEMPLATE ────────────────────────────────────────────────
function generateFarmacy(b: SiteBriefing, pal: Palette, name: string, waLink: string, ai?: AICopy | null): string {
  const mods = b.selected_modules ?? [];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:${pal.primary};--accent:${pal.accent};--light:${pal.light};--bg:#f8fafc;--surface:#ffffff;--surface2:#f1f5f9;--text:#0f172a;--muted:#64748b}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:1100px;margin:0 auto;padding:0 24px}
nav{background:var(--primary);padding:16px 0;position:sticky;top:0;z-index:100}
.nav-inner{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:1.2rem;font-weight:800;color:#fff}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{font-size:.875rem;font-weight:500;color:rgba(255,255,255,.8);transition:color .2s}
.nav-links a:hover{color:#fff}
.hero{background:linear-gradient(135deg,${pal.primary},${pal.accent});padding:80px 0;color:#fff}
.hero-tag{display:inline-block;background:rgba(255,255,255,.2);border-radius:999px;padding:6px 16px;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
.hero-title{font-size:clamp(2rem,5vw,3.2rem);font-weight:800;line-height:1.1;margin-bottom:16px;max-width:600px}
.hero-sub{font-size:1rem;color:rgba(255,255,255,.85);margin-bottom:32px;max-width:480px}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--primary);padding:14px 28px;border-radius:14px;font-weight:700;font-size:.95rem;transition:opacity .2s}
.btn-primary:hover{opacity:.9}
.btn-outline{display:inline-flex;align-items:center;gap:8px;border:2px solid rgba(255,255,255,.5);color:#fff;padding:14px 28px;border-radius:14px;font-weight:600;font-size:.95rem;transition:background .2s}
.btn-outline:hover{background:rgba(255,255,255,.1)}
.promo-bar{background:var(--accent);color:#fff;text-align:center;padding:12px;font-weight:700;font-size:.95rem}
.section{padding:80px 0}
.section-alt{background:var(--surface2)}
.section-header{text-align:center;margin-bottom:48px}
.eyebrow{font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.section-title{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:800;margin-top:8px;color:var(--text)}
.section-sub{color:var(--muted);margin-top:10px}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px}
.feature-card{background:var(--surface);border-radius:20px;padding:28px;box-shadow:0 1px 8px rgba(0,0,0,.06);border:1px solid #e2e8f0;transition:box-shadow .2s}
.feature-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.1)}
.feature-icon{width:48px;height:48px;border-radius:14px;background:var(--light);display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:1.5rem}
.feature-title{font-size:1rem;font-weight:700;margin-bottom:8px}
.feature-desc{font-size:.875rem;color:var(--muted)}
.prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px}
.prod-card{background:var(--surface);border-radius:20px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.06);border:1px solid #e2e8f0;transition:transform .2s}
.prod-card:hover{transform:translateY(-4px)}
.prod-img{width:100%;height:160px;object-fit:cover}
.prod-img-placeholder{width:100%;height:160px;background:var(--light)}
.prod-info{padding:16px}
.prod-name{display:block;font-size:.95rem;font-weight:700;margin-bottom:6px;color:var(--text)}
.prod-price{display:inline-block;color:var(--primary);font-weight:700}
.hours-box{max-width:500px;margin:0 auto;background:var(--surface);border-radius:20px;padding:32px;text-align:center;box-shadow:0 2px 16px rgba(0,0,0,.06)}
.hours-text p{color:var(--muted);margin-bottom:8px;font-size:.95rem}
.btn-wa{display:inline-flex;align-items:center;gap:10px;background:#16a34a;color:#fff;padding:14px 28px;border-radius:14px;font-weight:700;margin-top:24px}
.portfolio-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:24px}
.portfolio-card{background:var(--surface);border-radius:20px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.06)}
.portfolio-thumb{height:160px}
.portfolio-info{padding:20px}
.portfolio-tag{font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.portfolio-desc{font-size:.875rem;color:var(--muted);margin-top:8px}
.blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}
.blog-card{background:var(--surface);border-radius:20px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.06)}
.blog-thumb{height:140px}
.blog-body{padding:20px}
.blog-cat{font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.blog-title{font-size:1rem;font-weight:700;margin-top:8px;color:var(--text)}
.blog-excerpt{font-size:.875rem;color:var(--muted);margin-top:8px}
.cta-banner{background:linear-gradient(135deg,var(--primary),var(--accent));padding:64px 0;text-align:center;color:#fff}
.cta-banner h2{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:800;margin-bottom:12px}
.cta-banner p{color:rgba(255,255,255,.85);margin-bottom:28px}
footer{background:var(--primary);color:rgba(255,255,255,.9);padding:40px 0}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
.footer-logo{font-size:1.2rem;font-weight:800;color:#fff}
.footer-domain{font-size:.875rem;color:rgba(255,255,255,.7)}
.wa-float{position:fixed;bottom:24px;right:24px;z-index:999;width:56px;height:56px;border-radius:50%;background:#16a34a;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(22,163,74,.5);transition:transform .2s}
.wa-float:hover{transform:scale(1.1)}
@media(max-width:768px){.nav-links{display:none}}
</style>
</head>
<body>
<div class="promo-bar">✨ Atendimento especializado — Agende agora pelo WhatsApp</div>
<nav>
  <div class="container nav-inner">
    <span class="logo">${name}</span>
    <ul class="nav-links">
      ${mods.includes('catalogo') ? '<li><a href="#catalogo">Serviços</a></li>' : ''}
      ${mods.includes('agendamento') ? '<li><a href="#agendamento">Horários</a></li>' : ''}
      ${mods.includes('portfolio') ? '<li><a href="#portfolio">Casos</a></li>' : ''}
      <li><a href="#contato">Contato</a></li>
    </ul>
  </div>
</nav>
<section class="hero">
  <div class="container">
    <div class="hero-tag">🏥 Saúde & Bem-estar</div>
    <h1 class="hero-title">${name}</h1>
    <p class="hero-sub">${ai?.hero_subheadline ?? 'Cuidado especializado e atendimento humanizado. Sua saúde em boas mãos.'}</p>
    <div class="hero-ctas">
      ${mods.includes('agendamento') ? `<a href="#agendamento" class="btn-primary">Agendar Consulta</a>` : ''}
      ${mods.includes('whatsapp') ? `<a href="${waLink}" target="_blank" class="btn-outline">📱 WhatsApp</a>` : ''}
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow" style="color:${pal.primary}">Diferenciais</span>
      <h2 class="section-title">Por que escolher a ${name}?</h2>
    </div>
    <div class="features-grid">
      ${(ai?.services ?? [
        {icon:'🩺',name:'Equipe Especializada',description:'Profissionais qualificados e atualizados com as melhores práticas.'},
        {icon:'📅',name:'Agendamento Fácil',description:'Marque sua consulta diretamente pelo WhatsApp, sem complicação.'},
        {icon:'💚',name:'Atendimento Humano',description:'Cada paciente é único. Tratamos com atenção e cuidado individual.'},
      ]).map(s=>`<div class="feature-card"><div class="feature-icon">${s.icon}</div><div class="feature-title">${s.name}</div><div class="feature-desc">${s.description}</div></div>`).join('')}
    </div>
  </div>
</section>
${mods.includes('catalogo') ? catalogSection(b.catalog_products, pal) : ''}
${mods.includes('agendamento') ? hoursSection(b.business_hours, waLink, pal) : ''}
${mods.includes('portfolio') ? portfolioSection(pal) : ''}
${mods.includes('blog') ? blogSection(pal) : ''}
<section id="contato" class="cta-banner">
  <div class="container">
    <h2>${ai?.cta_main ?? 'Pronto para cuidar da sua saúde?'}</h2>
    <p>${ai?.cta_sub ?? 'Agende agora pelo WhatsApp. Retornamos em instantes!'}</p>
    <a href="${waLink}" target="_blank" class="btn-wa" style="margin:0 auto">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.857L0 24l6.335-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-5.007-1.374l-.36-.213-3.724.882.93-3.618-.234-.372A9.794 9.794 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
      Agendar pelo WhatsApp
    </a>
  </div>
</section>
<footer><div class="container footer-inner"><span class="footer-logo">${name}</span><span class="footer-domain">${b.domain ? `${b.domain}.com.br` : ''}</span><span class="footer-domain" style="font-size:.75rem">Feito com SitePronto</span></div></footer>
${mods.includes('whatsapp') ? waFloat(waLink) : ''}
</body></html>`;
}

// ─── STORE TEMPLATE ───────────────────────────────────────────────────────────
function generateStore(b: SiteBriefing, pal: Palette, name: string, waLink: string, ai?: AICopy | null): string {
  const mods = b.selected_modules ?? [];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:${pal.primary};--accent:${pal.accent};--light:${pal.light};--bg:#ffffff;--surface:#f8fafc;--surface2:#f1f5f9;--text:#111827;--muted:#6b7280}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:1100px;margin:0 auto;padding:0 24px}
nav{background:#fff;border-bottom:1px solid #e5e7eb;padding:16px 0;position:sticky;top:0;z-index:100}
.nav-inner{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:1.3rem;font-weight:800;color:var(--text)}
.logo span{color:var(--accent)}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{font-size:.875rem;font-weight:500;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--text)}
.hero{background:linear-gradient(135deg,var(--light),${pal.accent}22);padding:80px 0;border-bottom:1px solid #e5e7eb}
.hero-tag{display:inline-block;background:var(--light);color:var(--primary);border-radius:999px;padding:6px 16px;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
.hero-title{font-size:clamp(2rem,5vw,3.2rem);font-weight:800;line-height:1.1;margin-bottom:16px}
.hero-sub{font-size:1rem;color:var(--muted);margin-bottom:32px;max-width:480px}
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:14px 28px;border-radius:12px;font-weight:700;font-size:.95rem;transition:opacity .2s}
.btn-primary:hover{opacity:.88}
.btn-secondary{display:inline-flex;align-items:center;gap:8px;background:var(--surface);border:1.5px solid #e5e7eb;color:var(--text);padding:14px 28px;border-radius:12px;font-weight:600;font-size:.95rem}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
.section{padding:80px 0}
.section-alt{background:var(--surface)}
.section-header{text-align:center;margin-bottom:48px}
.eyebrow{font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.section-title{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:800;margin-top:8px}
.section-sub{color:var(--muted);margin-top:10px}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px}
.feature-card{padding:28px;border-radius:20px;background:#fff;border:1px solid #e5e7eb}
.feature-icon{font-size:1.8rem;margin-bottom:16px}
.feature-title{font-size:1rem;font-weight:700;margin-bottom:8px}
.feature-desc{font-size:.875rem;color:var(--muted)}
.prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:24px}
.prod-card{background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e5e7eb;transition:box-shadow .2s}
.prod-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.1)}
.prod-img{width:100%;height:200px;object-fit:cover}
.prod-img-placeholder{width:100%;height:200px;background:var(--light);display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--muted)}
.prod-info{padding:16px}
.prod-name{display:block;font-size:.95rem;font-weight:700;margin-bottom:6px}
.prod-price{display:inline-block;color:var(--accent);font-weight:800;font-size:1.1rem}
.add-btn{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:var(--primary);color:#fff;border-radius:8px;float:right;font-size:1.2rem;cursor:pointer}
.hours-box{max-width:500px;margin:0 auto;background:#fff;border-radius:20px;padding:32px;text-align:center;border:1px solid #e5e7eb}
.hours-text p{color:var(--muted);margin-bottom:8px}
.btn-wa{display:inline-flex;align-items:center;gap:10px;background:#16a34a;color:#fff;padding:14px 28px;border-radius:14px;font-weight:700;margin-top:24px}
.portfolio-grid,.blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}
.portfolio-card,.blog-card{background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e5e7eb}
.portfolio-thumb,.blog-thumb{height:160px}
.portfolio-info,.blog-body{padding:20px}
.portfolio-tag,.blog-cat{font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.portfolio-desc,.blog-excerpt{font-size:.875rem;color:var(--muted);margin-top:8px}
.blog-title{font-size:1rem;font-weight:700;margin-top:8px}
.cta-banner{background:var(--primary);padding:64px 0;text-align:center;color:#fff}
.cta-banner h2{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:800;margin-bottom:12px}
.cta-banner p{color:rgba(255,255,255,.85);margin-bottom:28px}
footer{background:#111827;color:rgba(255,255,255,.75);padding:40px 0}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
.footer-logo{font-size:1.2rem;font-weight:800;color:#fff}
.wa-float{position:fixed;bottom:24px;right:24px;z-index:999;width:56px;height:56px;border-radius:50%;background:#16a34a;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(22,163,74,.5);transition:transform .2s}
.wa-float:hover{transform:scale(1.1)}
@media(max-width:768px){.nav-links{display:none}}
</style>
</head>
<body>
<nav>
  <div class="container nav-inner">
    <span class="logo">${name}<span>.</span></span>
    <ul class="nav-links">
      ${mods.includes('catalogo') ? '<li><a href="#catalogo">Produtos</a></li>' : ''}
      ${mods.includes('agendamento') ? '<li><a href="#agendamento">Horários</a></li>' : ''}
      <li><a href="#contato">Contato</a></li>
    </ul>
  </div>
</nav>
<section class="hero">
  <div class="container">
    <div class="hero-tag">🛍️ Loja Online</div>
    <h1 class="hero-title">${name}</h1>
    <p class="hero-sub">${ai?.hero_subheadline ?? 'Os melhores produtos com qualidade garantida e entrega rápida. Compre com confiança.'}</p>
    <div class="hero-ctas">
      ${mods.includes('catalogo') ? `<a href="#catalogo" class="btn-primary">Ver Produtos</a>` : ''}
      ${mods.includes('whatsapp') ? `<a href="${waLink}" target="_blank" class="btn-secondary">📱 Pedir pelo WhatsApp</a>` : ''}
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="features-grid">
      ${(ai?.services ?? [
        {icon:'🚚',name:'Entrega Rápida',description:'Envio ágil para todo o Brasil com rastreamento em tempo real.'},
        {icon:'✅',name:'Qualidade Garantida',description:'Produtos selecionados com procedência e qualidade comprovada.'},
        {icon:'💬',name:'Suporte Direto',description:'Atendimento pelo WhatsApp para dúvidas e pedidos especiais.'},
      ]).map(s=>`<div class="feature-card"><div class="feature-icon">${s.icon}</div><div class="feature-title">${s.name}</div><div class="feature-desc">${s.description}</div></div>`).join('')}
    </div>
  </div>
</section>
${mods.includes('catalogo') ? catalogSection(b.catalog_products, pal) : ''}
${mods.includes('agendamento') ? hoursSection(b.business_hours, waLink, pal) : ''}
${mods.includes('portfolio') ? portfolioSection(pal) : ''}
${mods.includes('blog') ? blogSection(pal) : ''}
<section id="contato" class="cta-banner">
  <div class="container">
    <h2>${ai?.cta_main ?? 'Quer fazer um pedido especial?'}</h2>
    <p>${ai?.cta_sub ?? 'Fale diretamente com a gente pelo WhatsApp.'}</p>
    <a href="${waLink}" target="_blank" class="btn-wa" style="margin:0 auto">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.857L0 24l6.335-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-5.007-1.374l-.36-.213-3.724.882.93-3.618-.234-.372A9.794 9.794 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
      Falar pelo WhatsApp
    </a>
  </div>
</section>
<footer><div class="container footer-inner"><span class="footer-logo">${name}</span><span style="font-size:.875rem;color:rgba(255,255,255,.5)">${b.domain ? `${b.domain}.com.br` : ''} · Feito com SitePronto</span></div></footer>
${mods.includes('whatsapp') ? waFloat(waLink) : ''}
</body></html>`;
}

// ─── PORTFOLIO TEMPLATE ───────────────────────────────────────────────────────
function generatePortfolio(b: SiteBriefing, pal: Palette, name: string, waLink: string, ai?: AICopy | null): string {
  const mods = b.selected_modules ?? [];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:${pal.primary};--accent:${pal.accent};--light:${pal.light};--bg:#0f172a;--surface:#1e293b;--surface2:#0f172a;--text:#f8fafc;--muted:#94a3b8}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:1100px;margin:0 auto;padding:0 24px}
nav{background:rgba(15,23,42,.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.06);padding:20px 0;position:sticky;top:0;z-index:100}
.nav-inner{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:1.2rem;font-weight:800}
.logo span{color:var(--primary)}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{font-size:.875rem;font-weight:500;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--text)}
.hero{min-height:90vh;display:flex;align-items:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 50% -20%,${pal.primary}30,transparent 70%)}
.hero-inner{position:relative;max-width:700px}
.hero-tag{display:inline-flex;align-items:center;gap:8px;background:${pal.primary}20;border:1px solid ${pal.primary}40;border-radius:999px;padding:8px 18px;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:24px;color:var(--primary)}
.hero-title{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;line-height:1.05;letter-spacing:-.02em;margin-bottom:20px}
.hero-title span{color:var(--primary)}
.hero-sub{font-size:1.1rem;color:var(--muted);margin-bottom:36px;max-width:560px}
.hero-ctas{display:flex;gap:14px;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:15px 32px;border-radius:14px;font-weight:700;font-size:.95rem;transition:opacity .2s}
.btn-primary:hover{opacity:.88}
.btn-outline{display:inline-flex;align-items:center;gap:8px;border:1.5px solid rgba(255,255,255,.2);color:var(--text);padding:15px 32px;border-radius:14px;font-weight:600;font-size:.95rem;transition:background .2s}
.btn-outline:hover{background:rgba(255,255,255,.06)}
.stats{display:flex;gap:40px;margin-top:48px;padding-top:40px;border-top:1px solid rgba(255,255,255,.08)}
.stat-num{font-size:1.8rem;font-weight:800;color:var(--primary)}
.stat-label{font-size:.8rem;color:var(--muted);margin-top:2px}
.section{padding:96px 0}
.section-alt{background:var(--surface)}
.section-header{margin-bottom:56px}
.section-header.centered{text-align:center}
.eyebrow{font-size:.78rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--primary)}
.section-title{font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:800;margin-top:10px;line-height:1.2}
.section-sub{color:var(--muted);margin-top:12px;font-size:1rem}
.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}
.service-card{background:var(--surface);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:32px;transition:border-color .2s,transform .2s}
.service-card:hover{border-color:${pal.primary}55;transform:translateY(-4px)}
.service-icon{width:52px;height:52px;border-radius:16px;background:${pal.primary}20;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:1.6rem}
.service-title{font-size:1.05rem;font-weight:700;margin-bottom:10px}
.service-desc{font-size:.875rem;color:var(--muted);line-height:1.7}
.prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px}
.prod-card{background:var(--surface);border:1px solid rgba(255,255,255,.07);border-radius:20px;overflow:hidden;transition:transform .2s}
.prod-card:hover{transform:translateY(-4px)}
.prod-img{width:100%;height:160px;object-fit:cover}
.prod-img-placeholder{width:100%;height:160px;background:${pal.primary}18}
.prod-info{padding:16px}
.prod-name{display:block;font-size:.95rem;font-weight:700;margin-bottom:6px}
.prod-price{color:var(--primary);font-weight:700}
.hours-box{max-width:500px;margin:0 auto;background:var(--surface);border-radius:20px;padding:32px;text-align:center;border:1px solid rgba(255,255,255,.07)}
.hours-text p{color:var(--muted);margin-bottom:8px}
.btn-wa{display:inline-flex;align-items:center;gap:10px;background:#16a34a;color:#fff;padding:14px 28px;border-radius:14px;font-weight:700;margin-top:24px}
.portfolio-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}
.portfolio-card{background:var(--surface);border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,.07);transition:transform .2s}
.portfolio-card:hover{transform:translateY(-4px)}
.portfolio-thumb{height:200px}
.portfolio-info{padding:24px}
.portfolio-tag{font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--primary)}
.portfolio-desc{font-size:.875rem;color:var(--muted);margin-top:10px;line-height:1.6}
.blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}
.blog-card{background:var(--surface);border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,.07)}
.blog-thumb{height:140px}
.blog-body{padding:20px}
.blog-cat{font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--primary)}
.blog-title{font-size:1rem;font-weight:700;margin-top:8px}
.blog-excerpt{font-size:.875rem;color:var(--muted);margin-top:8px}
.cta-section{padding:96px 0;text-align:center;position:relative;overflow:hidden}
.cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 50%,${pal.primary}25,transparent 70%)}
.cta-title{font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:800;margin-bottom:16px;position:relative}
.cta-sub{color:var(--muted);margin-bottom:36px;font-size:1rem;position:relative}
footer{border-top:1px solid rgba(255,255,255,.06);padding:48px 0}
.footer-inner{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.footer-logo{font-size:1.3rem;font-weight:800}
.footer-logo span{color:var(--primary)}
.footer-domain{font-size:.875rem;color:var(--muted)}
.wa-float{position:fixed;bottom:24px;right:24px;z-index:999;width:56px;height:56px;border-radius:50%;background:#16a34a;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(22,163,74,.5);transition:transform .2s}
.wa-float:hover{transform:scale(1.1)}
@media(max-width:768px){.nav-links{display:none}.stats{gap:24px}}
</style>
</head>
<body>
<nav>
  <div class="container nav-inner">
    <span class="logo">${name}<span>.</span></span>
    <ul class="nav-links">
      <li><a href="#servicos">Serviços</a></li>
      ${mods.includes('portfolio') ? '<li><a href="#portfolio">Portfólio</a></li>' : ''}
      ${mods.includes('blog') ? '<li><a href="#blog">Blog</a></li>' : ''}
      <li><a href="#contato">Contato</a></li>
    </ul>
  </div>
</nav>
<section class="hero">
  <div class="container hero-inner">
    <div class="hero-tag">⚡ Especialistas</div>
    <h1 class="hero-title">${name}<span>.</span></h1>
    <p class="hero-sub">${ai?.hero_subheadline ?? 'Soluções profissionais com resultados comprovados. Transformamos desafios em oportunidades de crescimento.'}</p>
    <div class="hero-ctas">
      <a href="#contato" class="btn-primary">Fale Conosco</a>
      ${mods.includes('portfolio') ? `<a href="#portfolio" class="btn-outline">Ver Portfólio</a>` : ''}
    </div>
    <div class="stats">
      <div><div class="stat-num">+50</div><div class="stat-label">Clientes atendidos</div></div>
      <div><div class="stat-num">5★</div><div class="stat-label">Avaliação média</div></div>
      <div><div class="stat-num">100%</div><div class="stat-label">Comprometidos</div></div>
    </div>
  </div>
</section>
<section id="servicos" class="section">
  <div class="container">
    <div class="section-header centered">
      <span class="eyebrow">O que fazemos</span>
      <h2 class="section-title">Nossos Serviços</h2>
      <p class="section-sub">Soluções completas para o seu negócio crescer com estratégia.</p>
    </div>
    <div class="services-grid">
      ${(ai?.services ?? [
        {icon:'🎯',name:'Consultoria Estratégica',description:'Análise completa do seu negócio com recomendações práticas para crescimento.'},
        {icon:'📊',name:'Análise e Resultados',description:'Métricas e relatórios detalhados para decisões baseadas em dados.'},
        {icon:'🚀',name:'Execução e Entrega',description:'Implementação ágil com foco em resultado e prazo definido.'},
      ]).map(s=>`<div class="service-card"><div class="service-icon">${s.icon}</div><div class="service-title">${s.name}</div><div class="service-desc">${s.description}</div></div>`).join('')}
    </div>
  </div>
</section>
${mods.includes('catalogo') ? catalogSection(b.catalog_products, pal) : ''}
${mods.includes('agendamento') ? hoursSection(b.business_hours, waLink, pal) : ''}
${mods.includes('portfolio') ? portfolioSection(pal) : ''}
${mods.includes('blog') ? blogSection(pal) : ''}
<section id="contato" class="cta-section">
  <div class="container">
    <h2 class="cta-title">${ai?.cta_main ?? 'Pronto para começar?'}</h2>
    <p class="cta-sub">${ai?.cta_sub ?? 'Entre em contato hoje e vamos transformar seu negócio juntos.'}</p>
    <a href="${waLink}" target="_blank" class="btn-wa" style="margin:0 auto">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.857L0 24l6.335-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-5.007-1.374l-.36-.213-3.724.882.93-3.618-.234-.372A9.794 9.794 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
      Falar pelo WhatsApp
    </a>
  </div>
</section>
<footer><div class="container footer-inner"><span class="footer-logo">${name}<span>.</span></span><span class="footer-domain">${b.domain ? `${b.domain}.com.br` : ''} · Feito com SitePronto</span></div></footer>
${mods.includes('whatsapp') ? waFloat(waLink) : ''}
</body></html>`;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
export function generateSiteHTML(briefing: SiteBriefing): string {
  const pal = PALETTES[briefing.palette] ?? PALETTES['azul-editorial'];
  const name = formatBusinessName(briefing.domain, briefing.segment);
  const waLink = whatsappLink(briefing.whatsapp_number);
  const tpl = briefing.template || 'portfolio';
  const { ai } = parseAICopyFromNotes(briefing.content_notes);

  if (tpl === 'restaurant') return generateRestaurant(briefing, pal, name, waLink, ai);
  if (tpl === 'farmacy')    return generateFarmacy(briefing, pal, name, waLink, ai);
  if (tpl === 'store')      return generateStore(briefing, pal, name, waLink, ai);
  return generatePortfolio(briefing, pal, name, waLink, ai);
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

Dúvidas? Acesse sitepronto.com.br ou responda o e-mail de confirmação.
`;
}
