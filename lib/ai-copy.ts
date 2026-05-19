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
  restaurant: 'fundo escuro com cores quentes, estilo gastronômico, hero com visual de pratos, seção de horários e WhatsApp',
  farmacy: 'layout limpo e claro, cores suaves, seção de especialidades, promoções e agendamento online',
  store: 'grid de produtos minimalista, barra de filtros, carrinho e newsletter',
  portfolio: 'dark mode profissional, seção de skills, grid de projetos, depoimentos e CTA',
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

  const objLabel = OBJECTIVE_LABELS[input.objective] ?? input.objective;
  const modulesLabel = input.modules.map(m => MODULE_LABELS[m] ?? m).join(', ') || 'padrão';
  const templateDesc = TEMPLATE_DESCRIPTIONS[input.template] ?? 'layout profissional responsivo';

  const hasDescription = (input.description ?? '').trim().length > 20;
  const hasName = (input.businessName ?? '').trim().length > 1;

  const contextHint = hasDescription
    ? `O cliente forneceu a seguinte descrição do negócio: "${input.description}"`
    : hasName
    ? `O cliente informou apenas o nome "${input.businessName}". Pesquise mentalmente o que negócios com esse nome costumam oferecer no mercado brasileiro e use esse conhecimento para gerar textos específicos e plausíveis.`
    : `Nenhuma descrição foi fornecida. Use o tipo de negócio para gerar textos plausíveis e profissionais para o mercado brasileiro.`;

  const paletteHint = input.palette && input.paletteColors
    ? `A paleta de cores escolhida é "${input.palette}" com as cores: primária ${input.paletteColors.primary}, destaque ${input.paletteColors.accent}. Gere textos que combinem com essa identidade visual.`
    : '';

  const prompt = `Você é copywriter especialista em sites para pequenas empresas brasileiras. Sua tarefa é gerar textos que soem autênticos, específicos ao negócio — não genéricos.

**Negócio:** "${input.businessName || 'Meu Negócio'}"
**Tipo:** ${objLabel}
**Template escolhido:** ${input.template} — ${templateDesc}
**Seções do site:** ${modulesLabel}
${paletteHint}
**Contexto:** ${contextHint}

Instruções:
- Se o cliente descreveu o negócio, extraia diferenciais reais da descrição (produtos, serviços, localização, público, método de trabalho)
- Se a descrição menciona um link ou site existente, imagine o que esse negócio provavelmente oferece e escreva com especificidade
- Se pouca informação foi fornecida, use o nome e tipo para inferir o segmento e gerar textos que fariam sentido para esse tipo de empresa no Brasil
- Nunca use frases genéricas como "Qualidade e excelência", "Seu sucesso é nossa missão" — sempre prefira especificidade
- Escreva em português brasileiro informal mas profissional
- Gere image_prompts como descrições curtas para fotos de banco de imagens (ex: "prato de massa italiana em mesa rústica")
- Gere seo_keywords com 5-8 palavras-chave relevantes para o negócio no mercado brasileiro

Responda APENAS com este JSON válido (sem markdown, sem bloco de código):
{
  "hero_subheadline": "frase de impacto de até 15 palavras que descreve o negócio de forma específica",
  "cta_main": "texto do botão CTA principal (máx 4 palavras)",
  "cta_sub": "frase de apoio ao CTA (máx 10 palavras)",
  "services": [
    {"name": "Nome do Diferencial ou Serviço 1", "description": "descrição em 1 frase específica ao negócio", "icon": "emoji relevante"},
    {"name": "Nome do Diferencial ou Serviço 2", "description": "descrição em 1 frase específica ao negócio", "icon": "emoji relevante"},
    {"name": "Nome do Diferencial ou Serviço 3", "description": "descrição em 1 frase específica ao negócio", "icon": "emoji relevante"}
  ],
  "footer_tagline": "tagline da empresa em até 6 palavras",
  "image_prompts": {
    "hero": "descrição curta para foto principal do site (máx 10 palavras)",
    "gallery": ["descrição 1", "descrição 2", "descrição 3"],
    "catalog": "descrição genérica para fotos de produtos/serviços"
  },
  "seo_keywords": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5"]
}

services deve ter exatamente 3 itens. gallery deve ter exatamente 3 itens. seo_keywords deve ter 5 a 8 itens.`;

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
