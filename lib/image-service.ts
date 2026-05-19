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

export function generateHeroSVG(pal: PaletteColors, label = ''): string {
  const { r: pr, g: pg, b: pb } = hexToRgb(pal.primary);
  const { r: ar, g: ag, b: ab } = hexToRgb(pal.accent);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
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
  <circle cx="650" cy="200" r="160" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <circle cx="580" cy="180" r="100" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <circle cx="700" cy="280" r="70" fill="rgba(${ar},${ag},${ab},0.05)"/>
  <rect x="200" y="150" width="120" height="120" rx="60" fill="rgba(${pr},${pg},${pb},0.08)" transform="rotate(15 260 210)"/>
  <rect x="180" y="140" width="90" height="90" rx="20" fill="rgba(${ar},${ag},${ab},0.06)" transform="rotate(-10 225 185)"/>
  ${label ? `<text x="300" y="340" font-family="system-ui,sans-serif" font-size="24" font-weight="700" fill="rgba(${pr},${pg},${pb},0.3)" text-anchor="middle">${escapeXml(label)}</text>` : ''}
</svg>`;
}

// ─── PRODUCT PLACEHOLDER ─────────────────────────────────────────────────────

export function generateProductSVG(pal: PaletteColors): string {
  const { r: pr, g: pg, b: pb } = hexToRgb(pal.primary);
  const { r: ar, g: ag, b: ab } = hexToRgb(pal.accent);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(${pr},${pg},${pb},0.08)"/>
      <stop offset="100%" stop-color="rgba(${ar},${ag},${ab},0.05)"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#pg1)"/>
  <circle cx="150" cy="130" r="50" fill="rgba(${pr},${pg},${pb},0.1)"/>
  <circle cx="150" cy="130" r="30" fill="rgba(${ar},${ag},${ab},0.08)"/>
  <circle cx="150" cy="130" r="15" fill="rgba(${pr},${pg},${pb},0.12)"/>
  <rect x="90" y="200" width="120" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="110" y="216" width="80" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.12)"/>
</svg>`;
}

// ─── GALLERY IMAGE ───────────────────────────────────────────────────────────

export function generateGallerySVG(pal: PaletteColors, index = 0): string {
  const { r: pr, g: pg, b: pb } = hexToRgb(pal.primary);
  const { r: ar, g: ag, b: ab } = hexToRgb(pal.accent);
  const colors = [pal.primary, pal.accent, pal.light, pal.primary, pal.accent, pal.light];
  const bgColor = colors[index % colors.length];
  const { r: br, g: bg, b: bb } = hexToRgb(bgColor);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="rgba(${br},${bg},${bb},0.15)"/>
  <rect x="50" y="40" width="300" height="200" rx="16" fill="rgba(${pr},${pg},${pb},0.06)"/>
  <circle cx="200" cy="140" r="40" fill="rgba(${ar},${ag},${ab},0.1)"/>
  <circle cx="200" cy="140" r="20" fill="rgba(${pr},${pg},${pb},0.12)"/>
  <rect x="120" y="190" width="60" height="8" rx="4" fill="rgba(${pr},${pg},${pb},0.15)"/>
  <rect x="135" y="204" width="30" height="6" rx="3" fill="rgba(${ar},${ag},${ab},0.1)"/>
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
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
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
