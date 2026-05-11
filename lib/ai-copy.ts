export type AICopy = {
  hero_subheadline: string;
  cta_main: string;
  cta_sub: string;
  services: { name: string; description: string; icon: string }[];
  footer_tagline: string;
};

const OBJECTIVE_LABELS: Record<string, string> = {
  'vender-produtos': 'loja ou comércio que vende produtos',
  'servicos': 'prestação de serviços',
  'portfolio': 'portfólio profissional',
  'institucional': 'site institucional de empresa',
};

export async function generateAICopy(input: {
  businessName: string;
  objective: string;
  description: string;
  template: string;
  modules: string[];
}): Promise<AICopy | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const objLabel = OBJECTIVE_LABELS[input.objective] ?? input.objective;
  const modulesLabel = input.modules.join(', ') || 'padrão';

  const prompt = `Você é copywriter especialista em sites para pequenas empresas brasileiras.

Gere textos profissionais para o site de: "${input.businessName || 'Meu Negócio'}"
Tipo de negócio: ${objLabel}
Descrição fornecida pelo cliente: "${input.description || 'não informada'}"
Seções do site: ${modulesLabel}

Responda APENAS com este JSON válido (sem markdown, sem bloco de código):
{
  "hero_subheadline": "frase de impacto de até 15 palavras que descreve o negócio",
  "cta_main": "texto do botão CTA principal (máx 4 palavras)",
  "cta_sub": "frase de apoio ao CTA (máx 10 palavras)",
  "services": [
    {"name": "Nome do Diferencial ou Serviço 1", "description": "descrição em 1 frase curta", "icon": "emoji relevante"},
    {"name": "Nome do Diferencial ou Serviço 2", "description": "descrição em 1 frase curta", "icon": "emoji relevante"},
    {"name": "Nome do Diferencial ou Serviço 3", "description": "descrição em 1 frase curta", "icon": "emoji relevante"}
  ],
  "footer_tagline": "tagline da empresa em até 6 palavras"
}

Regras obrigatórias:
- Escreva em português brasileiro informal mas profissional
- Seja específico ao negócio descrito, evite frases genéricas
- services deve ter exatamente 3 itens`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
        signal: AbortSignal.timeout(12000),
      }
    );

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (!parsed.hero_subheadline || !Array.isArray(parsed.services) || parsed.services.length < 3) {
      return null;
    }
    return parsed as AICopy;
  } catch {
    return null;
  }
}

export function parseAICopyFromNotes(contentNotes: string | null): { businessName: string; description: string; ai: AICopy | null } {
  if (!contentNotes) return { businessName: '', description: '', ai: null };
  try {
    const parsed = JSON.parse(contentNotes);
    if (parsed && typeof parsed === 'object' && 'description' in parsed) {
      return {
        businessName: String(parsed.businessName ?? ''),
        description: String(parsed.description ?? ''),
        ai: parsed.ai ?? null,
      };
    }
  } catch {
    // not JSON — treat as plain description (legacy)
  }
  return { businessName: '', description: contentNotes, ai: null };
}
