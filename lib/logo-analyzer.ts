// ─── LOGO COLOR ANALYZER ─────────────────────────────────────────────────────
// Usa Gemini Vision para extrair as cores principais do logo enviado pelo usuário
// e mapear para a paleta mais próxima das 9 disponíveis no quiz.

export type LogoColors = {
  primary: string;
  accent: string;
  suggested_palette: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
};

// Mesmas 9 paletas do site-generator/index.ts
const PALETTE_SAMPLES: Record<string, { primary: string; accent: string; label: string }> = {
  'azul-editorial': { primary: '#004ac6', accent: '#2563eb', label: 'Azul Editorial' },
  'verde-servico':  { primary: '#0f766e', accent: '#14b8a6', label: 'Verde Serviço' },
  'vinho-premium':  { primary: '#7f1d1d', accent: '#be123c', label: 'Vinho Premium' },
  'minimal':        { primary: '#374151', accent: '#6b7280', label: 'Minimal' },
  'vibrant':        { primary: '#004ac6', accent: '#eab308', label: 'Vibrant' },
  'corporate':      { primary: '#002855', accent: '#004ac6', label: 'Corporate' },
  'nature':         { primary: '#059669', accent: '#f97316', label: 'Nature' },
  'tech':           { primary: '#111827', accent: '#06b6d4', label: 'Tech' },
  'elegant':        { primary: '#2b1b17', accent: '#b58e58', label: 'Elegant' },
};

// Converte hex para RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

// Distância euclidiana entre duas cores RGB
function colorDistance(hex1: string, hex2: string): number {
  const a = hexToRgb(hex1);
  const b = hexToRgb(hex2);
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)
  );
}

// Encontra a paleta mais próxima das cores extraídas pelo Gemini
export function findClosestPalette(extractedPrimary: string, extractedAccent: string): string {
  let bestId = 'azul-editorial';
  let bestScore = Infinity;

  for (const [id, palette] of Object.entries(PALETTE_SAMPLES)) {
    const distPrimary = colorDistance(extractedPrimary, palette.primary);
    const distAccent  = colorDistance(extractedAccent,  palette.accent);
    const score = distPrimary * 0.6 + distAccent * 0.4; // primary tem mais peso
    if (score < bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  return bestId;
}

// Analisa o logo via Gemini Vision e retorna cores + paleta sugerida
export async function analyzeLogoColors(base64Image: string): Promise<LogoColors | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  // Remove prefixo data:image/...;base64, se presente
  const imageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  const mimeType  = base64Image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

  const prompt = `Analise este logo e extraia as cores principais.

Retorne APENAS um JSON válido (sem markdown) com:
- primary_hex: a cor mais dominante ou principal do logo (formato "#RRGGBB")
- accent_hex: a cor secundária/de destaque do logo (formato "#RRGGBB"). Se só tiver uma cor, use uma versão mais clara ou escura da primary.
- confidence: "high" se as cores são claras, "medium" se há dúvida, "low" se o logo é muito simples (ex: só texto preto)
- reason: 1 frase explicando quais cores você viu (ex: "Logo azul escuro com detalhes em laranja")

Regras:
- Se o logo for preto/branco/cinza, marque confidence como "low" e use #374151 como primary e #6b7280 como accent
- Nunca retorne #000000 ou #ffffff como primary — prefira tons mais ricos
- Arredonde para a cor mais representativa, não para uma média exata

JSON esperado:
{
  "primary_hex": "#RRGGBB",
  "accent_hex": "#RRGGBB",
  "confidence": "high" | "medium" | "low",
  "reason": "..."
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: imageData } },
            ],
          }],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.1,
            maxOutputTokens: 200,
          },
        }),
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) return null;

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (!parsed.primary_hex || !parsed.accent_hex) return null;

    // Valida formato hex
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(parsed.primary_hex) || !hexRegex.test(parsed.accent_hex)) return null;

    const suggested_palette = findClosestPalette(parsed.primary_hex, parsed.accent_hex);

    return {
      primary: parsed.primary_hex,
      accent:  parsed.accent_hex,
      suggested_palette,
      confidence: parsed.confidence ?? 'medium',
      reason: parsed.reason ?? '',
    };
  } catch {
    return null;
  }
}
