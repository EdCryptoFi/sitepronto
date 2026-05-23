export type PaletteColors = { primary: string; accent: string; light: string; dark: string };

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── HERO IMAGE ──────────────────────────────────────────────────────────────

// ─── INDUSTRY-SPECIFIC HERO PATTERNS ─────────────────────────────────────────

const HERO_PATTERNS: Record<string, (pr: number, pg: number, pb: number, ar: number, ag: number, ab: number) => string> = {
  mecanica: (pr, pg, pb, ar, ag, ab) => `
  <circle cx="600" cy="250" r="140" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <circle cx="650" cy="220" r="80" fill="none" stroke="rgba(${ar},${ag},${ab},0.12)" stroke-width="6"/>
  <circle cx="650" cy="220" r="50" fill="none" stroke="rgba(${pr},${pg},${pb},0.08)" stroke-width="4"/>
  <circle cx="650" cy="220" r="20" fill="rgba(${ar},${ag},${ab},0.1)"/>
  <rect x="180" y="160" width="140" height="140" rx="20" fill="rgba(${pr},${pg},${pb},0.08)" transform="rotate(30 250 230)"/>
  <rect x="200" y="180" width="100" height="100" rx="12" fill="rgba(${ar},${ag},${ab},0.06)" transform="rotate(-15 250 230)"/>
  <circle cx="250" cy="230" r="15" fill="rgba(${pr},${pg},${pb},0.1)"/>
  <circle cx="250" cy="230" r="6" fill="rgba(${ar},${ag},${ab},0.12)"/>`,

  restaurante: (pr, pg, pb, ar, ag, ab) => `
  <circle cx="620" cy="220" r="150" fill="rgba(${pr},${pg},${pb},0.07)"/>
  <circle cx="620" cy="220" r="90" fill="rgba(${ar},${ag},${ab},0.06)"/>
  <circle cx="620" cy="220" r="40" fill="rgba(${pr},${pg},${pb},0.05)"/>
  <rect x="160" y="140" width="160" height="160" rx="80" fill="rgba(${ar},${ag},${ab},0.08)" transform="rotate(10 240 220)"/>
  <rect x="190" y="170" width="100" height="100" rx="50" fill="rgba(${pr},${pg},${pb},0.06)" transform="rotate(-5 240 220)"/>
  <rect x="220" y="200" width="40" height="40" rx="8" fill="rgba(${ar},${ag},${ab},0.1)" transform="rotate(45 240 220)"/>`,

  clinica: (pr, pg, pb, ar, ag, ab) => `
  <rect x="560" y="100" width="100" height="200" rx="20" fill="rgba(${pr},${pg},${pb},0.07)"/>
  <rect x="580" y="130" width="60" height="140" rx="10" fill="rgba(${ar},${ag},${ab},0.06)"/>
  <rect x="590" y="140" width="10" height="30" rx="3" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <rect x="620" y="140" width="10" height="30" rx="3" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <circle cx="220" cy="200" r="120" fill="rgba(${pr},${pg},${pb},0.05)"/>
  <circle cx="220" cy="200" r="70" fill="rgba(${ar},${ag},${ab},0.04)"/>
  <rect x="190" y="170" width="60" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <rect x="190" y="186" width="60" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.08)"/>`,

  loja: (pr, pg, pb, ar, ag, ab) => `
  <rect x="520" y="140" width="160" height="180" rx="16" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="540" y="160" width="120" height="60" rx="8" fill="rgba(${ar},${ag},${ab},0.06)"/>
  <rect x="560" y="240" width="80" height="12" rx="4" fill="rgba(${pr},${pg},${pb},0.1)"/>
  <rect x="570" y="260" width="60" height="8" rx="4" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <circle cx="200" cy="200" r="100" fill="rgba(${pr},${pg},${pb},0.05)"/>
  <circle cx="200" cy="200" r="60" fill="rgba(${ar},${ag},${ab},0.04)"/>
  <rect x="160" y="180" width="80" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <rect x="170" y="196" width="60" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.06)"/>`,

  advocacia: (pr, pg, pb, ar, ag, ab) => `
  <rect x="160" y="150" width="100" height="180" rx="6" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="170" y="160" width="80" height="12" rx="3" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <rect x="170" y="180" width="80" height="6" rx="2" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="170" y="194" width="80" height="6" rx="2" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="170" y="208" width="80" height="6" rx="2" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <circle cx="620" cy="220" r="130" fill="rgba(${pr},${pg},${pb},0.05)"/>
  <circle cx="620" cy="220" r="75" fill="rgba(${ar},${ag},${ab},0.04)"/>
  <circle cx="620" cy="220" r="35" fill="rgba(${pr},${pg},${pb},0.04)"/>`,

  beleza: (pr, pg, pb, ar, ag, ab) => `
  <circle cx="600" cy="200" r="100" fill="rgba(${ar},${ag},${ab},0.07)"/>
  <circle cx="600" cy="200" r="65" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <circle cx="600" cy="200" r="35" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <circle cx="600" cy="200" r="12" fill="rgba(${pr},${pg},${pb},0.1)"/>
  <rect x="180" y="160" width="120" height="120" rx="60" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="210" y="190" width="60" height="60" rx="30" fill="rgba(${ar},${ag},${ab},0.06)"/>
  <rect x="230" y="210" width="20" height="20" rx="10" fill="rgba(${pr},${pg},${pb},0.08)"/>`,

  construcao: (pr, pg, pb, ar, ag, ab) => `
  <rect x="560" y="130" width="180" height="240" rx="8" fill="rgba(${pr},${pg},${pb},0.05)"/>
  <rect x="580" y="150" width="140" height="40" rx="4" fill="rgba(${ar},${ag},${ab},0.06)"/>
  <rect x="580" y="200" width="140" height="80" rx="4" fill="rgba(${pr},${pg},${pb},0.04)"/>
  <rect x="600" y="220" width="100" height="12" rx="3" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <rect x="610" y="240" width="80" height="8" rx="3" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <circle cx="200" cy="220" r="90" fill="rgba(${pr},${pg},${pb},0.05)"/>
  <rect x="170" y="190" width="60" height="60" rx="6" fill="rgba(${ar},${ag},${ab},0.06)" transform="rotate(45 200 220)"/>`,

  educacao: (pr, pg, pb, ar, ag, ab) => `
  <rect x="550" y="120" width="80" height="200" rx="12" fill="rgba(${pr},${pg},${pb},0.06)"/>
  ${[0,1,2,3].map(i => `<rect x="560" y="${140 + i * 40}" width="60" height="8" rx="3" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <rect x="560" y="${152 + i * 40}" width="40" height="6" rx="2" fill="rgba(${pr},${pg},${pb},0.05)"/>`).join('')}
  <circle cx="220" cy="220" r="110" fill="rgba(${pr},${pg},${pb},0.05)"/>
  <circle cx="220" cy="200" r="40" fill="rgba(${ar},${ag},${ab},0.06)"/>
  <rect x="200" y="250" width="40" height="6" rx="3" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <rect x="195" y="262" width="50" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.06)"/>`,
};

export function generateHeroSVG(pal: PaletteColors, label = '', industry = 'generico'): string {
  const { r: pr, g: pg, b: pb } = hexToRgb(pal.primary);
  const { r: ar, g: ag, b: ab } = hexToRgb(pal.accent);
  const patternFn = HERO_PATTERNS[industry] ?? HERO_PATTERNS.loja;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" style="border-radius:16px">
  <defs>
    <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(${pr},${pg},${pb},0.12)"/>
      <stop offset="100%" stop-color="rgba(${ar},${ag},${ab},0.08)"/>
    </linearGradient>
    <radialGradient id="hg2" cx="60%" cy="40%" r="50%">
      <stop offset="0%" stop-color="rgba(${pr},${pg},${pb},0.15)"/>
      <stop offset="100%" stop-color="rgba(${pr},${pg},${pb},0)"/>
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#hg1)"/>
  <rect width="800" height="500" fill="url(#hg2)"/>
  ${patternFn(pr, pg, pb, ar, ag, ab)}
  ${label ? `<text x="300" y="340" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="rgba(${pr},${pg},${pb},0.35)" text-anchor="middle">${escapeXml(label)}</text>` : ''}
</svg>`;
}

// ─── PRODUCT PLACEHOLDER ─────────────────────────────────────────────────────

const PRODUCT_PATTERNS: Record<string, (pr: number, pg: number, pb: number, ar: number, ag: number, ab: number) => string> = {
  mecanica: (pr, pg, pb, ar, ag, ab) => `
  <circle cx="150" cy="120" r="55" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <circle cx="150" cy="120" r="35" fill="none" stroke="rgba(${ar},${ag},${ab},0.12)" stroke-width="5"/>
  <circle cx="150" cy="120" r="15" fill="rgba(${ar},${ag},${ab},0.1)"/>
  <rect x="100" y="195" width="100" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="115" y="211" width="70" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.12)"/>`,
  restaurante: (pr, pg, pb, ar, ag, ab) => `
  <circle cx="150" cy="130" r="50" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <circle cx="150" cy="130" r="30" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <circle cx="150" cy="130" r="12" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <rect x="90" y="200" width="120" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="110" y="216" width="80" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.12)"/>`,
  clinica: (pr, pg, pb, ar, ag, ab) => `
  <rect x="120" y="80" width="60" height="100" rx="12" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <rect x="135" y="100" width="30" height="20" rx="6" fill="rgba(${ar},${ag},${ab},0.1)"/>
  <rect x="135" y="130" width="30" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.12)"/>
  <rect x="100" y="195" width="100" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="115" y="211" width="70" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.12)"/>`,
  loja: (pr, pg, pb, ar, ag, ab) => `
  <rect x="100" y="80" width="100" height="100" rx="16" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="115" y="100" width="70" height="40" rx="8" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <rect x="110" y="150" width="80" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.12)"/>
  <rect x="100" y="195" width="100" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="115" y="211" width="70" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.12)"/>`,
};

export function generateProductSVG(pal: PaletteColors, industry = 'generico'): string {
  const { r: pr, g: pg, b: pb } = hexToRgb(pal.primary);
  const { r: ar, g: ag, b: ab } = hexToRgb(pal.accent);
  const patternFn = PRODUCT_PATTERNS[industry] ?? PRODUCT_PATTERNS.loja;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(${pr},${pg},${pb},0.08)"/>
      <stop offset="100%" stop-color="rgba(${ar},${ag},${ab},0.05)"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#pg1)"/>
  ${patternFn(pr, pg, pb, ar, ag, ab)}
</svg>`;
}

// ─── GALLERY IMAGE ───────────────────────────────────────────────────────────

const GALLERY_PATTERNS: Record<string, (pr: number, pg: number, pb: number, ar: number, ag: number, ab: number) => string> = {
  mecanica: (pr, pg, pb, ar, ag, ab) => `
  <rect x="40" y="30" width="320" height="200" rx="12" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <circle cx="200" cy="130" r="35" fill="rgba(${ar},${ag},${ab},0.1)"/>
  <circle cx="200" cy="130" r="20" fill="none" stroke="rgba(${pr},${pg},${pb},0.12)" stroke-width="4"/>
  <rect x="120" y="180" width="60" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="135" y="194" width="30" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.1)"/>`,
  restaurante: (pr, pg, pb, ar, ag, ab) => `
  <rect x="40" y="30" width="320" height="200" rx="16" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <circle cx="200" cy="120" r="45" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <circle cx="200" cy="120" r="20" fill="rgba(${pr},${pg},${pb},0.08)"/>
  <rect x="120" y="180" width="60" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="135" y="194" width="30" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.1)"/>`,
  clinica: (pr, pg, pb, ar, ag, ab) => `
  <rect x="40" y="30" width="320" height="200" rx="8" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="160" y="70" width="80" height="120" rx="10" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="175" y="90" width="50" height="40" rx="6" fill="rgba(${ar},${ag},${ab},0.1)"/>
  <rect x="120" y="180" width="60" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="135" y="194" width="30" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.1)"/>`,
  loja: (pr, pg, pb, ar, ag, ab) => `
  <rect x="40" y="30" width="320" height="200" rx="12" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="160" y="80" width="80" height="90" rx="10" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <rect x="175" y="100" width="50" height="30" rx="6" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <rect x="120" y="180" width="60" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="135" y="194" width="30" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.1)"/>`,
};

export function generateGallerySVG(pal: PaletteColors, index = 0, industry = 'generico'): string {
  const { r: pr, g: pg, b: pb } = hexToRgb(pal.primary);
  const { r: ar, g: ag, b: ab } = hexToRgb(pal.accent);
  const patternFn = GALLERY_PATTERNS[industry] ?? GALLERY_PATTERNS.loja;
  const colors = [pal.primary, pal.accent, pal.light, pal.primary, pal.accent, pal.light];
  const bgColor = colors[index % colors.length];
  const { r: br, g: bg, b: bb } = hexToRgb(bgColor);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="rgba(${br},${bg},${bb},0.15)"/>
  ${patternFn(pr, pg, pb, ar, ag, ab)}
  <path d="M0 260 Q100 240 200 260 T400 260 L400 300 L0 300 Z" fill="rgba(${pr},${pg},${pb},0.04)"/>
</svg>`;
}

// ─── AVATAR PLACEHOLDER ─────────────────────────────────────────────────────

export function generateAvatarSVG(pal: PaletteColors, initial: string): string {
  const { r: pr, g: pg, b: pb } = hexToRgb(pal.primary);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  <defs>
    <radialGradient id="ag1" cx="40%" cy="30%" r="60%">
      <stop offset="0%" stop-color="rgba(${pr},${pg},${pb},0.35)"/>
      <stop offset="100%" stop-color="rgba(${pr},${pg},${pb},0.15)"/>
    </radialGradient>
  </defs>
  <circle cx="40" cy="40" r="40" fill="url(#ag1)"/>
  <text x="40" y="46" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="rgba(${pr},${pg},${pb},0.5)" text-anchor="middle">${escapeXml(initial)}</text>
</svg>`;
}

// ─── BACKGROUND PATTERN ─────────────────────────────────────────────────────

export function generateBgPattern(pal: PaletteColors): string {
  const { r: pr, g: pg, b: pb } = hexToRgb(pal.primary);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
  <circle cx="30" cy="30" r="2" fill="rgba(${pr},${pg},${pb},0.04)"/>
  <circle cx="0" cy="0" r="3" fill="rgba(${pr},${pg},${pb},0.03)"/>
  <circle cx="60" cy="0" r="3" fill="rgba(${pr},${pg},${pb},0.03)"/>
  <circle cx="0" cy="60" r="3" fill="rgba(${pr},${pg},${pb},0.03)"/>
  <circle cx="60" cy="60" r="3" fill="rgba(${pr},${pg},${pb},0.03)"/>
  <circle cx="15" cy="15" r="1.5" fill="rgba(${pr},${pg},${pb},0.04)"/>
  <circle cx="45" cy="15" r="1.5" fill="rgba(${pr},${pg},${pb},0.04)"/>
  <circle cx="15" cy="45" r="1.5" fill="rgba(${pr},${pg},${pb},0.04)"/>
  <circle cx="45" cy="45" r="1.5" fill="rgba(${pr},${pg},${pb},0.04)"/>
</svg>`;
}

export function dataUrl(svg: string): string {
  if (typeof window === 'undefined') {
    const base64 = Buffer.from(svg, 'utf-8').toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// ─── CATEGORY ICONS ──────────────────────────────────────────────────────────

export function generateCategoryIcon(pal: PaletteColors, label: string): string {
  const { r: pr, g: pg, b: pb } = hexToRgb(pal.primary);
  const first = label.charAt(0).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="24" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <text x="60" y="68" font-family="system-ui,sans-serif" font-size="42" font-weight="700" fill="rgba(${pr},${pg},${pb},0.2)" text-anchor="middle">${escapeXml(first)}</text>
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
