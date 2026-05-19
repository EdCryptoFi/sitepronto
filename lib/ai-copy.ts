import { detectIndustry } from '@/lib/industry';

export type AICopy = {
  hero_subheadline: string;
  cta_main: string;
  cta_sub: string;
  services: { name: string; description: string; icon: string }[];
  footer_tagline: string;
  image_prompts?: {
    hero: string;
    gallery: string[];
    catalog: string;
  };
  seo_keywords?: string[];
};

const OBJECTIVE_LABELS: Record<string, string> = {
  'vender-produtos': 'loja ou comércio que vende produtos',
  'servicos': 'prestação de serviços',
  'portfolio': 'portfólio profissional',
  'institucional': 'site institucional de empresa',
};

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  restaurant: 'fundo escuro com cores quentes, estilo gastronômico',
  farmacy: 'layout limpo e claro, cores suaves, seção de especialidades',
  store: 'grid de produtos minimalista, barra de filtros',
  portfolio: 'dark mode profissional, seção de skills, grid de projetos',
};

const MODULE_LABELS: Record<string, string> = {
  servicos: 'catálogo de serviços/produtos',
  sobre: 'história da empresa',
  contato: 'horários e WhatsApp',
  galeria: 'galeria de fotos',
  depoimentos: 'depoimentos de clientes',
  faq: 'perguntas frequentes',
};

export async function generateAICopy(input: {
  businessName: string;
  objective: string;
  description: string;
  template: string;
  modules: string[];
  palette?: string;
  paletteColors?: Record<string, string>;
}): Promise<AICopy | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const industry = detectIndustry(input.businessName, input.description);
  const objLabel = OBJECTIVE_LABELS[input.objective] ?? input.objective;
  const modulesLabel = input.modules.map(m => MODULE_LABELS[m] ?? m).join(', ') || 'padrão';
  const templateDesc = TEMPLATE_DESCRIPTIONS[input.template] ?? 'layout profissional responsivo';

  const hasDescription = (input.description ?? '').trim().length > 5;
  const hasName = (input.businessName ?? '').trim().length > 1;

  let contextHint: string;
  let extractionInstructions: string;

  if (hasDescription) {
    contextHint = `O cliente forneceu a seguinte descrição do negócio: "${input.description}"`;
    extractionInstructions = `A descrição acima contém as ÚNICAS fontes de verdade sobre o negócio.
CRÍTICO: Você DEVE extrair serviços, produtos e diferenciais DIRETAMENTE da descrição.
- Se a descrição menciona "escapamento, pneus, alinhamento", os services DEVEM ser esses.
- Se menciona "pizza, esfiha, delivery", os services DEVEM ser sobre pizza e esfiha.
- NUNCA invente serviços que não estão na descrição.
- Copie as palavras EXATAS da descrição para compor os nomes dos serviços.`;
  } else if (hasName) {
    contextHint = `O cliente informou apenas o nome "${input.businessName}".`;
    const detectedLabel = industry.label;
    extractionInstructions = `O nome sugere que é do ramo de ${detectedLabel}.
Use seu conhecimento sobre empresas brasileiras desse segmento para gerar serviços REALISTAS e ESPECÍFICOS.
Exemplos de serviços REAIS para ${detectedLabel}: ${industry.fallbackServices.map(s => `"${s.name}"`).join(', ')}
NÃO use serviços genéricos como "Consultoria Estratégica" ou "Análise de Resultados".`;
  } else {
    contextHint = `Nenhuma descrição foi fornecida.`;
    extractionInstructions = `Use o tipo de negócio (${objLabel}) para gerar textos PLÁUSIVEIS para o mercado brasileiro.
Evite termos vagos. Prefira serviços concretos e específicos.`;
  }

  const paletteHint = input.palette && input.paletteColors
    ? `Paleta: primária ${input.paletteColors.primary}, destaque ${input.paletteColors.accent}.`
    : '';

  const prompt = `Você é copywriter especialista em sites para pequenas empresas brasileiras.

**Negócio:** "${input.businessName || 'Meu Negócio'}"
**Tipo:** ${objLabel}
**Template:** ${input.template} — ${templateDesc}
**Seções:** ${modulesLabel}
${paletteHint}
${contextHint}

${extractionInstructions}

⚠️ REGRAS ABSOLUTAS (NÃO IGNORE):
1. Os 3 services DEVEM ser EXTRAÍDOS da descrição do cliente — NUNCA invente serviços genéricos
2. Se a descrição cita serviços específicos (ex: "troca de óleo, alinhamento, pneus"), USE-OS exatamente
3. NUNCA use: "Consultoria Estratégica", "Análise e Resultados", "Execução e Entrega" ou variações genéricas
4. hero_subheadline deve mencionar algo ESPECÍFICO do negócio (localização, especialidade, diferencial)
5. image_prompts.hero deve descrever uma cena REALISTA do negócio (ex: "mecânico trabalhando em motor de carro")
6. Emoji dos services deve combinar com o serviço (🔧 para mecânica, 🍕 para pizza, 💇 para cabeleireiro)

Responda APENAS com este JSON (sem markdown):
{
  "hero_subheadline": "específica ao negócio, até 15 palavras",
  "cta_main": "até 4 palavras",
  "cta_sub": "até 10 palavras",
  "services": [
    {"name": "extraído da descrição", "description": "1 frase específica", "icon": "emoji relevante"},
    {"name": "extraído da descrição", "description": "1 frase específica", "icon": "emoji relevante"},
    {"name": "extraído da descrição", "description": "1 frase específica", "icon": "emoji relevante"}
  ],
  "footer_tagline": "até 6 palavras",
  "image_prompts": {
    "hero": "descrição para foto principal (máx 10 palavras)",
    "gallery": ["descrição 1", "descrição 2", "descrição 3"],
    "catalog": "descrição para fotos de produtos/serviços"
  },
  "seo_keywords": ["5-8 palavras-chave relevantes"]
}`;

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
            temperature: 0.4,
            maxOutputTokens: 1000,
          },
        }),
        signal: AbortSignal.timeout(20000),
      }
    );

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (!parsed.hero_subheadline || !Array.isArray(parsed.services) || parsed.services.length < 3) {
      return null;
    }

    // Validate that services are not generic
    const genericTerms = ['consultoria', 'estratégica', 'estratégico', 'resultados', 'execução', 'entrega'];
    const hasGeneric = parsed.services.some((s: { name: string }) =>
      genericTerms.some(t => s.name.toLowerCase().includes(t))
    );
    if (hasGeneric && hasDescription) {
      return null; // Reject if client gave description but AI ignored it
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
