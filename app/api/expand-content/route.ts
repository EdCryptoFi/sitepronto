import { NextRequest, NextResponse } from 'next/server';
import { detectIndustrySemantic, buildPromptContext } from '@/lib/context-engine';

export async function POST(req: NextRequest) {
  try {
    const { text, businessName, industry: industryId } = await req.json();
    if (!text || text.trim().length < 3) {
      return NextResponse.json({ error: 'Texto muito curto' }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json({ error: 'IA não disponível' }, { status: 503 });
    }

    const detection = await detectIndustrySemantic(businessName || '', text);
    const contextPack = buildPromptContext(detection.industry);

    const prompt = `Você é copywriter especialista em pequenas empresas brasileiras.

Contexto do segmento:
${contextPack}

Um cliente descreveu um serviço/produto assim: "${text}"

Expanda este texto em 2-3 frases persuasivas para um site.
Mantenha o tom e vocabulário do segmento. Seja específico, não genérico.
Use benefícios concretos. Adicione um diferencial competitivo.
Responda APENAS com o texto expandido, sem aspas ou markdown.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 200 },
        }),
        signal: AbortSignal.timeout(10000),
      }
    );

    const json = await res.json();
    const result = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) {
      return NextResponse.json({ error: 'IA não gerou resposta' }, { status: 500 });
    }

    return NextResponse.json({ expanded: result.trim() });
  } catch {
    return NextResponse.json({ error: 'Erro ao expandir texto' }, { status: 500 });
  }
}
