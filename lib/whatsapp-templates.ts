// ─── WHATSAPP MESSAGE TEMPLATES ──────────────────────────────────────────────
// Gera 3 mensagens de boas-vindas para WhatsApp específicas ao negócio,
// exibidas na página de sucesso pós-pagamento.

export type WATemplate = {
  label: string;   // ex: "Atendimento rápido"
  message: string; // mensagem pronta para copiar
};

export async function generateWATemplates(input: {
  businessName: string;
  segment: string;
  objective: string;
}): Promise<WATemplate[] | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const prompt = `Você é especialista em atendimento ao cliente por WhatsApp para pequenos negócios brasileiros.

Gere 3 mensagens de boas-vindas diferentes para o WhatsApp Business do negócio abaixo.
Cada mensagem deve ser natural, profissional e específica ao segmento.

Negócio: "${input.businessName}"
Segmento: "${input.segment}"
Objetivo: "${input.objective}"

Retorne APENAS JSON válido:
[
  {
    "label": "nome curto da abordagem (máx 4 palavras, ex: 'Saudação rápida')",
    "message": "mensagem completa pronta para usar no WhatsApp (2-4 linhas, sem emojis excessivos, tom adequado ao segmento)"
  },
  {
    "label": "Segunda abordagem",
    "message": "segunda mensagem com foco diferente (ex: mencionar horários, serviços, ou como agendar)"
  },
  {
    "label": "Terceira abordagem",
    "message": "terceira mensagem mais curta e direta, para resposta rápida"
  }
]

Regras:
- Use "Olá!" ou "Oi!" para cumprimentar — nunca "Prezado/a"
- Mencione o nome do negócio na primeira mensagem
- Adapte o tom ao segmento (restaurante = caloroso, clínica = profissional, loja = animado)
- Inclua algo de ação: "Como posso ajudar?", "Que data fica melhor para você?", "O que você está procurando?"
- Máx 4 linhas por mensagem`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: 'application/json', temperature: 0.5, maxOutputTokens: 500 },
        }),
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;

    const parsed = JSON.parse(raw) as WATemplate[];
    if (!Array.isArray(parsed) || parsed.length < 2) return null;

    return parsed.slice(0, 3);
  } catch {
    return null;
  }
}
