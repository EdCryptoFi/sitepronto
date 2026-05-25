// ─── DESCRIPTION COACH ───────────────────────────────────────────────────────
// Analisa a descrição do negócio digitada pelo usuário e retorna feedback
// sobre o que está faltando para gerar um site de alta qualidade.

export type CoachScore = 'fraca' | 'boa' | 'ótima';

export type CoachFeedback = {
  score: CoachScore;
  score_value: number;      // 0-100
  missing: string[];        // itens que faltam (ex: "serviços específicos")
  tip: string;              // dica principal curta (1 frase)
  improved?: string;        // versão melhorada da descrição (opcional)
};

export async function analyzeDescription(
  text: string,
  businessName: string,
  objective: string,
): Promise<CoachFeedback | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const trimmed = text.trim();
  if (trimmed.length < 5) {
    return {
      score: 'fraca',
      score_value: 0,
      missing: ['qualquer descrição do negócio'],
      tip: 'Descreva o que você faz e quem você atende.',
    };
  }

  const prompt = `Você é um assistente que ajuda donos de pequenos negócios brasileiros a escrever descrições melhores para o site deles.

Analise a descrição abaixo e avalie a qualidade para gerar um site profissional:

Negócio: "${businessName || 'Não informado'}"
Objetivo: "${objective}"
Descrição: "${trimmed}"

Avalie e retorne APENAS JSON válido (sem markdown):

{
  "score_value": <número de 0 a 100>,
  "score": "<fraca|boa|ótima>",
  "missing": ["<item faltando 1>", "<item faltando 2>"],
  "tip": "<dica curta de 1 frase sobre o que melhoraria mais a descrição>",
  "improved": "<versão melhorada da descrição em 2-3 frases, usando as informações existentes como base>"
}

Regras de pontuação:
- 0-39 → "fraca": falta serviços específicos, localização, ou é muito vaga
- 40-69 → "boa": tem informações básicas mas poderia ser mais específica
- 70-100 → "ótima": tem serviços claros, diferencial e/ou localização

Itens que melhoram a pontuação:
- Serviços/produtos específicos listados (+30 pts)
- Localização ou bairro (+15 pts)
- Diferencial ou especialidade (+15 pts)
- Público-alvo mencionado (+10 pts)
- Tempo de atuação ou experiência (+10 pts)

missing: liste apenas o que REALMENTE está faltando (máx 3 itens, em português curto)
tip: 1 frase direta, sem jargão, ex: "Liste os 3 principais serviços que você oferece."
improved: reescreva incorporando o que está na descrição original + complete os pontos faltantes de forma realista`;

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
            temperature: 0.3,
            maxOutputTokens: 400,
          },
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CoachFeedback;
    if (typeof parsed.score_value !== 'number' || !parsed.score || !parsed.tip) return null;

    return parsed;
  } catch {
    return null;
  }
}
