// ─── LAYOUT VARIATION HELPERS ────────────────────────────────────────────────
// Gera HTML estruturalmente diferente para cada variação (modern, classic, bold)
// Cada template chama estes helpers em vez de hardcodar nav/hero/services

import type { StyleVariationId } from './index';
import type { AICopy } from '@/lib/ai-copy';
import { dataUrl, generateHeroSVG } from '@/lib/image-service';

type Palette = { primary: string; accent: string; light: string; dark: string };

// ─── NAV ─────────────────────────────────────────────────────────────────────

export function renderNav(
  v: StyleVariationId,
  name: string,
  links: { label: string; href: string }[],
  pal: Palette,
  logoPreview?: string
): string {
  const logoInner = logoPreview
    ? `<img src="${logoPreview}" alt="${name}" style="height:36px;max-width:160px;object-fit:contain;display:block">`
    : name;
  const linkHTML = links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('');

  if (v === 'classic') {
    return `
<nav style="background:var(--surface);border-bottom:2px solid ${pal.primary}22">
  <div class="container" style="display:flex;flex-direction:column;align-items:center;padding:16px 24px;gap:12px">
    <span class="logo" style="font-size:1.4rem;font-weight:800;color:var(--accent)">${logoInner}</span>
    <ul style="display:flex;gap:24px;list-style:none;padding:0;margin:0;font-size:.85rem;font-weight:500">
      ${linkHTML}
    </ul>
  </div>
</nav>`;
  }

  if (v === 'bold') {
    return `
<nav style="position:sticky;top:0;z-index:100;background:rgba(0,0,0,.85);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.08)">
  <div class="container" style="display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 16px">
    <span class="logo" style="font-size:1.2rem;font-weight:900;color:var(--accent);letter-spacing:-.02em">${logoInner}</span>
    <button style="background:${pal.primary};color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:.78rem;font-weight:700;cursor:pointer" onclick="document.querySelector('#contato')?.scrollIntoView({behavior:'smooth'})">
      Fale Conosco
    </button>
  </div>
</nav>`;
  }

  // Modern (default) — inline horizontal
  return `
<nav style="position:sticky;top:0;z-index:100;background:var(--surface);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.06)">
  <div class="container" style="display:flex;align-items:center;justify-content:space-between;height:64px">
    <span class="logo" style="font-size:1.3rem;font-weight:800;color:var(--accent)">${logoInner}</span>
    <ul class="nav-links" style="display:flex;gap:28px;list-style:none;margin:0;padding:0">
      ${linkHTML}
    </ul>
  </div>
</nav>`;
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

type HeroInput = {
  v: StyleVariationId;
  name: string;
  subheadline: string;
  badge?: string;
  ctas: { label: string; href: string; primary?: boolean }[];
  stats?: { num: string; label: string }[];
  pal: Palette;
  industry?: string;
  imagePrompt?: string;
  image?: string;
};

export function renderHero(input: HeroInput): string {
  const { v, name, subheadline, badge, ctas, stats, pal, industry } = input;
  const img = input.image || dataUrl(generateHeroSVG(pal, name, industry ?? 'generico'));

  const ctasHTML = ctas.map(c =>
    c.primary
      ? `<a href="${c.href}" class="btn-main" style="background:${pal.primary};color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;display:inline-block">${c.label}</a>`
      : `<a href="${c.href}" class="btn-outline" style="border:2px solid ${pal.primary};color:var(--text);padding:12px 28px;border-radius:12px;font-weight:600;display:inline-block">${c.label}</a>`
  ).join(' ');

  const statsHTML = stats ? stats.map(s =>
    `<div><div class="stat-n" style="font-size:1.5rem;font-weight:800;color:${pal.primary}">${s.num}</div><div class="stat-l" style="font-size:.8rem;opacity:.6">${s.label}</div></div>`
  ).join('') : '';

  if (v === 'classic') {
    return `
<section class="hero" style="background:linear-gradient(180deg,${pal.light}88,transparent);padding:80px 0 60px;text-align:center">
  <div class="container" style="max-width:720px">
    ${badge ? `<span style="display:inline-block;background:${pal.primary}15;color:${pal.primary};padding:4px 16px;border-radius:20px;font-size:.8rem;font-weight:600;margin-bottom:20px">${badge}</span>` : ''}
    <h1 class="hero-title" style="font-size:clamp(2rem,4vw,2.8rem);font-weight:800;line-height:1.15">${name}</h1>
    <p class="hero-sub" style="font-size:1.1rem;opacity:.7;margin-top:16px;max-width:560px;margin-left:auto;margin-right:auto">${subheadline}</p>
    <div class="hero-ctas" style="display:flex;gap:12px;justify-content:center;margin-top:28px">${ctasHTML}</div>
    ${statsHTML ? `<div class="hero-stats" style="display:flex;gap:32px;justify-content:center;margin-top:40px">${statsHTML}</div>` : ''}
    <div style="margin-top:40px;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.08);max-width:600px;margin-left:auto;margin-right:auto">
      <img src="${img}" alt="${name}" style="width:100%;height:240px;object-fit:cover;display:block" />
    </div>
  </div>
</section>`;
  }

  if (v === 'bold') {
    return `
<section class="hero" style="position:relative;min-height:500px;display:flex;align-items:center;overflow:hidden;background:linear-gradient(135deg,${pal.dark},${pal.primary}88)">
  <div style="position:absolute;inset:0;opacity:.15">
    <img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover" />
  </div>
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,${pal.dark}dd 0%,${pal.dark}88 50%,transparent 100%)"></div>
  <div class="container" style="position:relative;z-index:2;padding:80px 24px;max-width:700px">
    ${badge ? `<span style="display:inline-block;background:${pal.accent};color:#fff;padding:6px 20px;border-radius:6px;font-size:.8rem;font-weight:700;margin-bottom:20px;text-transform:uppercase;letter-spacing:.1em">${badge}</span>` : ''}
    <h1 class="hero-title" style="font-size:clamp(2.5rem,5vw,3.5rem);font-weight:900;line-height:1.05;color:#fff">${name}</h1>
    <p class="hero-sub" style="font-size:1.1rem;opacity:.8;margin-top:16px;color:rgba(255,255,255,.8)">${subheadline}</p>
    <div class="hero-ctas" style="display:flex;gap:12px;margin-top:32px">${ctasHTML}</div>
    ${statsHTML ? `<div class="hero-stats" style="display:flex;gap:40px;margin-top:40px">${statsHTML.replace(/"stat-n"/g, '"stat-n" style="color:' + pal.accent + ';font-size:1.8rem"').replace(/"stat-l"/g, '"stat-l" style="color:rgba(255,255,255,.6)"')}</div>` : ''}
  </div>
</section>`;
  }

  // Modern (default) — split layout
  return `
<section class="hero" style="padding:0">
  <div class="container hero-split" style="display:flex;align-items:center;gap:40px;min-height:480px">
    <div class="hero-content" style="flex:1;padding:60px 0">
      ${badge ? `<div class="hero-badge" style="display:inline-flex;align-items:center;gap:6px;background:${pal.primary}12;color:${pal.primary};padding:6px 14px;border-radius:20px;font-size:.82rem;font-weight:600;margin-bottom:16px">${badge}</div>` : ''}
      <h1 class="hero-title" style="font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:800;line-height:1.1">${name}</h1>
      <p class="hero-sub" style="font-size:1.05rem;opacity:.65;margin-top:14px">${subheadline}</p>
      <div class="hero-ctas" style="display:flex;gap:10px;margin-top:24px">${ctasHTML}</div>
      ${statsHTML ? `<div class="hero-stats" style="display:flex;gap:24px;margin-top:32px">${statsHTML}</div>` : ''}
    </div>
    <div class="hero-visual" style="flex:1;border-radius:20px;overflow:hidden;min-height:320px;max-height:400px">
      <img src="${img}" alt="${name}" style="width:100%;height:100%;object-fit:cover;display:block" />
    </div>
  </div>
</section>`;
}

// ─── SERVICES DISPLAY ─────────────────────────────────────────────────────────

type ServiceItem = { icon: string; name: string; description: string };

export function renderServices(
  v: StyleVariationId,
  services: ServiceItem[],
  pal: Palette,
  title?: string
): string {
  const sectionTitle = title ?? 'Nossos diferenciais';

  if (v === 'classic') {
    return `
<section style="padding:80px 0;background:var(--surface2, #f8fafc)">
  <div class="container" style="max-width:700px">
    <div class="sec-hdr centered" style="text-align:center;margin-bottom:40px">
      <span class="eyebrow" style="color:${pal.primary};font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em">Diferenciais</span>
      <h2 class="sec-title" style="font-size:clamp(1.5rem,2.5vw,2rem);font-weight:800;margin-top:8px">${sectionTitle}</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      ${services.map(s => `
      <div style="display:flex;align-items:center;gap:18px;padding:20px 24px;background:var(--bg,#fff);border-radius:8px;border-left:4px solid ${pal.primary};box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <span style="font-size:1.8rem;flex-shrink:0">${s.icon}</span>
        <div>
          <div style="font-weight:700;font-size:.95rem">${s.name}</div>
          <div style="font-size:.88rem;opacity:.65;margin-top:4px">${s.description}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
  }

  if (v === 'bold') {
    return `
<section style="padding:80px 0;background:linear-gradient(180deg,var(--bg),${pal.primary}08)">
  <div class="container">
    <div class="sec-hdr centered" style="text-align:center;margin-bottom:40px">
      <span class="eyebrow" style="color:${pal.accent};font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em">Serviços</span>
      <h2 class="sec-title" style="font-size:clamp(1.8rem,3vw,2.4rem);font-weight:900;margin-top:8px">${sectionTitle}</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px">
      ${services.map(s => `
      <div style="border:2px solid ${pal.primary}22;border-radius:16px;padding:32px 24px;text-align:center;background:var(--surface);transition:transform .2s,box-shadow .2s">
        <div style="width:64px;height:64px;border-radius:16px;background:${pal.primary}15;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 16px">${s.icon}</div>
        <div style="font-weight:800;font-size:1.05rem">${s.name}</div>
        <div style="font-size:.88rem;opacity:.6;margin-top:8px;line-height:1.6">${s.description}</div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
  }

  // Modern (default) — grid cards
  return `
<section style="padding:80px 0">
  <div class="container">
    <div class="sec-hdr centered" style="text-align:center;margin-bottom:48px">
      <span class="eyebrow" style="color:${pal.primary};font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em">Serviços</span>
      <h2 class="sec-title" style="font-size:clamp(1.5rem,2.5vw,2rem);font-weight:800;margin-top:8px">${sectionTitle}</h2>
    </div>
    <div class="features-row" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">
      ${services.map(s => `
      <div class="feat-card" style="padding:28px;border-radius:20px;background:var(--surface2,#f8fafc);text-align:center;transition:transform .2s,box-shadow .2s">
        <div style="font-size:2.2rem;margin-bottom:12px">${s.icon}</div>
        <div class="feat-title" style="font-weight:700;font-size:.95rem">${s.name}</div>
        <div class="feat-desc" style="font-size:.88rem;opacity:.6;margin-top:6px;line-height:1.6">${s.description}</div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}
