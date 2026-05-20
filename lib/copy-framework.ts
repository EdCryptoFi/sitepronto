// ─── COPYWRITING FRAMEWORKS ──────────────────────────────────────────────────

export type FrameworkId = 'aida' | 'pas' | 'fab' | 'bbb';

export type CopyFramework = {
  id: FrameworkId;
  name: string;
  label: string;
  description: string;
  pattern: string;
  promptInstruction: string;
};

export const COPY_FRAMEWORKS: CopyFramework[] = [
  {
    id: 'aida',
    name: 'AIDA',
    label: 'Atenção → Interesse → Desejo → Ação',
    description: 'Clássico para vendas. Prende atenção, gera interesse, cria desejo, chama à ação.',
    pattern: 'Atenção → Interesse → Desejo → Ação',
    promptInstruction: 'Estrutura AIDA: abra com um gancho forte (Atenção), destaque benefícios (Interesse), mostre resultados (Desejo), termine com CTA direto (Ação).',
  },
  {
    id: 'pas',
    name: 'PAS',
    label: 'Problema → Agitação → Solução',
    description: 'Eficaz para serviços. Mostra a dor, agrava o problema, oferece a cura.',
    pattern: 'Problema → Agitação → Solução',
    promptInstruction: 'Estrutura PAS: apresente o problema do cliente, agite a dor com consequências, ofereça seu serviço como solução.',
  },
  {
    id: 'fab',
    name: 'FAB',
    label: 'Feature → Advantage → Benefit',
    description: 'Bom para produtos. Mostra característica, vantagem e benefício real.',
    pattern: 'Característica → Vantagem → Benefício',
    promptInstruction: 'Estrutura FAB: para cada serviço, liste uma característica, a vantagem que ela traz e o benefício final para o cliente.',
  },
  {
    id: 'bbb',
    name: 'Antes-Depois-Ponte',
    label: 'Antes → Depois → Ponte',
    description: 'Mostra a transformação. Situação atual vs situação desejada, e como chegar lá.',
    pattern: 'Antes (dor) → Depois (solução) → Ponte (seu serviço)',
    promptInstruction: 'Estrutura Antes-Depois-Ponte: pinte o cenário atual (Antes), mostre o resultado ideal (Depois), apresente seu serviço como a Ponte.',
  },
];

// ─── TONE & PERSONA GUIDELINES PER INDUSTRY ──────────────────────────────────

export type ToneGuidelines = {
  voice: string;
  vocabulary: string[];
  avoid: string[];
  ctaStyle: string;
  socialProof: string;
};

export const TONE_GUIDELINES: Record<string, ToneGuidelines> = {
  mecanica: {
    voice: 'Técnico mas acolhedor. Passa confiança e expertise. Usa linguagem de mecânico de verdade.',
    vocabulary: ['diagnóstico', 'reparo', 'revisão completa', 'peças originais', 'garantia', 'orçamento sem compromisso'],
    avoid: ['solução inovadora', 'transformação digital', 'sinergia', 'disruptivo'],
    ctaStyle: 'Direto e urgente: "Solicitar Orçamento", "Agendar Reparo", "Diagnóstico Grátis"',
    socialProof: '"Mais de 1.000 carros reparados" / "5★ no Google" / "Atendimento rápido e honesto"',
  },
  restaurante: {
    voice: 'Caloroso, sensorial, convidativo. Evoca sabores, aromas e momentos.',
    vocabulary: ['selecionados', 'fresco', 'artesanal', 'receita especial', 'ingredientes', 'chef', 'harmonia'],
    avoid: ['solução', 'estratégia', 'performance', 'otimização', 'sinergia'],
    ctaStyle: 'Convidativo e saboroso: "Faça seu Pedido", "Reserve sua Mesa", "Experimente"',
    socialProof: '"Mais de 500 clientes satisfeitos" / "Nota 4.9 no iFood" / "O melhor da região"',
  },
  clinica: {
    voice: 'Profissional, acolhedor e empático. Transmite segurança e cuidado.',
    vocabulary: ['atendimento humanizado', 'bem-estar', 'prevenção', 'qualidade de vida', 'cuidado', 'acolhimento'],
    avoid: ['venda', 'promoção', 'imperdível', 'lucro', 'faturamento'],
    ctaStyle: 'Cuidadoso: "Agende sua Consulta", "Fale Conosco", "Saiba Mais"',
    socialProof: '"98% de satisfação" / "Referência na região" / "Centenas de pacientes atendidos"',
  },
  loja: {
    voice: 'Amigável e persuasivo. Foco em ofertas, qualidade e conveniência.',
    vocabulary: ['qualidade', 'entrega rápida', 'garantia', 'melhor preço', 'lançamento', 'coleção', 'imperdível'],
    avoid: ['consultoria', 'estratégia', 'cases', 'portfólio'],
    ctaStyle: 'Persuasivo: "Compre Agora", "Garanta o Seu", "Oferta Limitada"',
    socialProof: '"Mais de 10.000 vendas" / "Entrega em todo Brasil" / "Clientes satisfeitos"',
  },
  advocacia: {
    voice: 'Sóbrio, confiável e técnico. Vocabulário jurídico acessível.',
    vocabulary: ['escritório', 'solução jurídica', 'direitos', 'processo', 'consulta', 'contrato'],
    avoid: ['barato', 'promoção', 'imperdível', 'oportunidade única'],
    ctaStyle: 'Profissional: "Solicitar Consulta", "Agendar Atendimento", "Entrar em Contato"',
    socialProof: '"Décadas de experiência" / "Casos de sucesso" / "Especialistas em direito"',
  },
  beleza: {
    voice: 'Entusiástico, moderno e acolhedor. Foco em autoestima e transformação.',
    vocabulary: ['transformação', 'autoestima', 'cuidado', 'tendências', 'estilo', 'resultado', 'beleza'],
    avoid: ['mecânico', 'reparo', 'diagnóstico', 'conserto'],
    ctaStyle: 'Animado: "Agende seu Horário", "Transforme-se", "Venha Conhecer"',
    socialProof: '"Destaque em revistas" / "Clientes apaixonadas" / "Profissionais certificados"',
  },
  construcao: {
    voice: 'Confiável, transparente e direto. Foco em prazo, orçamento e qualidade.',
    vocabulary: ['projeto', 'reforma', 'obra', 'prazo', 'orçamento', 'qualidade', 'mão de obra'],
    avoid: ['abstrato', 'filosofia', 'intangível', 'sinergia'],
    ctaStyle: 'Transparente: "Solicite Orçamento", "Agende Visita", "Simule seu Projeto"',
    socialProof: '"+50 obras entregues" / "Nota máxima em satisfação" / "Referência em construção"',
  },
  educacao: {
    voice: 'Inspirador e acessível. Transmite paixão por ensinar e aprender.',
    vocabulary: ['aprendizado', 'conhecimento', 'transformação', 'metodologia', 'carreira', 'futuro'],
    avoid: ['barato', 'fácil', 'milagroso', 'solução mágica'],
    ctaStyle: 'Inspirador: "Matricule-se Já", "Comece Hoje", "Invista em Você"',
    socialProof: '"Milhares de alunos formados" / "Aprovados em concursos" / "Referência em ensino"',
  },
};

// ─── FEW-SHOT EXAMPLES ───────────────────────────────────────────────────────

export const FEW_SHOT_EXAMPLES: Record<string, string> = {
  portfolio: `{
  "hero_subheadline": "Há 10 anos transformando ideias em projetos que geram resultado para nossos clientes.",
  "cta_main": "Solicitar Orçamento",
  "cta_sub": "Orçamento rápido e sem compromisso",
  "services": [
    {"name": "Projetos Elétricos", "description": "Projetos completos de instalações elétricas prediais e industriais, com segurança e eficiência.", "icon": "⚡"},
    {"name": "Reformas Residenciais", "description": "Reforma total ou parcial com acompanhamento de engenheiro e garantia de 5 anos.", "icon": "🔨"},
    {"name": "Design de Interiores", "description": "Ambientes planejados que unem estética, funcionalidade e conforto para seu lar.", "icon": "🛋️"}
  ],
  "footer_tagline": "Qualidade que constrói confiança",
  "image_prompts": {
    "hero": "engenheiro civil analisando planta em obra",
    "gallery": ["projeto arquitetônico em mesa", "reforma de sala com acabamento", "fachada de casa moderna"],
    "catalog": "amostra de materiais de construção"
  },
  "seo_keywords": ["engenharia", "projetos", "reformas", "construção civil", "design de interiores", "arquitetura", "SP"]
}`,

  restaurant: `{
  "hero_subheadline": "Massas artesanais preparadas com ingredientes frescos e receitas que passam de geração em geração.",
  "cta_main": "Faça seu Pedido",
  "cta_sub": "Peça pelo WhatsApp e ganhe frete grátis",
  "services": [
    {"name": "Pizzas Especiais", "description": "Massa fermentada 48h, molho caseiro e ingredientes selecionados. Forno à lenha.", "icon": "🍕"},
    {"name": "Massas Artesanais", "description": "Talharim, ravioli e nhoque feitos à mão com farinha importada e ovos caipiras.", "icon": "🍝"},
    {"name": "Bebidas & Sobremesas", "description": "Carta de vinhos selecionados e sobremesas premiadas, como nosso pudim clássico.", "icon": "🍷"}
  ],
  "footer_tagline": "Sabor que alimenta a alma",
  "image_prompts": {
    "hero": "prato de massa artesanal com molho e ervas frescas",
    "gallery": ["pizza saindo do forno a lenha", "interior aconchegante do restaurante", "bartender preparando drink"],
    "catalog": "prato principal decorado"
  },
  "seo_keywords": ["restaurante", "massas artesanais", "pizza a lenha", "delivery", "jantar romântico", "gastronomia", "SP"]
}`,

  farmacy: `{
  "hero_subheadline": "Atendimento humanizado com profissionais que cuidam de você e da sua família há mais de 15 anos.",
  "cta_main": "Agendar Consulta",
  "cta_sub": "Agende pelo WhatsApp em 2 minutos",
  "services": [
    {"name": "Clínico Geral", "description": "Consultas completas com avaliação detalhada e encaminhamento para especialistas quando necessário.", "icon": "🩺"},
    {"name": "Exames Laboratoriais", "description": "Coleta e análise com equipamentos modernos e resultados em até 24 horas úteis.", "icon": "🔬"},
    {"name": "Vacinação", "description": "Calendário vacinal completo para todas as idades, com enfermeiras treinadas.", "icon": "💉"}
  ],
  "footer_tagline": "Sua saúde em boas mãos",
  "image_prompts": {
    "hero": "médico atendendo paciente em consultório moderno",
    "gallery": ["sala de espera acolhedora", "equipamento de diagnóstico", "farmácia com medicamentos"],
    "catalog": "produtos de saúde e bem-estar"
  },
  "seo_keywords": ["clínica médica", "consultas", "exames", "vacinação", "saúde", "bem-estar", "plano de saúde"]
}`,

  store: `{
  "hero_subheadline": "Os melhores produtos importados com garantia original e entrega em todo o Brasil.",
  "cta_main": "Compre Agora",
  "cta_sub": "Frete grátis para primeira compra",
  "services": [
    {"name": "Eletrônicos", "description": "Smartphones, fones e acessórios originais com garantia de 12 meses e nota fiscal.", "icon": "📱"},
    {"name": "Moda & Acessórios", "description": "Roupas e acessórios importados das melhores marcas com curadoria semanal.", "icon": "👕"},
    {"name": "Casa & Decoração", "description": "Objetos de decoração, utilidades domésticas e itens de design selecionados.", "icon": "🏠"}
  ],
  "footer_tagline": "Qualidade que você merece",
  "image_prompts": {
    "hero": "vitrine moderna com produtos organizados",
    "gallery": ["produtos em exposição", "cliente recebendo compra", "embalagem personalizada"],
    "catalog": "produto em destaque com fundo clean"
  },
  "seo_keywords": ["loja online", "e-commerce", "produtos importados", "eletrônicos", "moda", "casa e decoração", "frete grátis"]
}`,
};

// ─── SEO HELPERS ─────────────────────────────────────────────────────────────

export type BusinessSEO = {
  name: string;
  description: string;
  phone: string;
  address?: string;
  url: string;
  image: string;
};

export function generateJSONLD(seo: BusinessSEO): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: seo.name,
    description: seo.description,
    url: seo.url,
    telephone: seo.phone,
    image: seo.image,
    address: seo.address ? {
      '@type': 'PostalAddress',
      streetAddress: seo.address,
    } : undefined,
    priceRange: '$$',
    openingHours: 'Mo-Fr 09:00-18:00',
    sameAs: [`https://wa.me/${seo.phone.replace(/\D/g, '')}`],
  });
}

export function generateOGTags(title: string, description: string, url: string, image: string): string {
  return `
<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
`.trim();
}
