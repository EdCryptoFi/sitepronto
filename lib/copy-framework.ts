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
  veterinaria: {
    voice: 'Afetuoso, confiável e técnico. Fala com quem ama animais — combina cuidado emocional com expertise veterinária.',
    vocabulary: ['bem-estar animal', 'petparent', 'cuidado especializado', 'protocolo vacinal', 'prevenção', 'diagnóstico precoce'],
    avoid: ['barato', 'rápido demais', 'solução imediata', 'sem complicação'],
    ctaStyle: 'Afetuoso e tranquilizador: "Agendar Consulta", "Cuidar do Meu Pet", "Falar com o Veterinário"',
    socialProof: '"Mais de 5.000 pets atendidos" / "Equipe especializada" / "Nota 5 no Google"',
  },
  petshop: {
    voice: 'Alegre, apaixonado por animais e acessível. Tom de quem é amigo do pet e do tutor.',
    vocabulary: ['petparent', 'mimado', 'confortável', 'saudável', 'bem-estar', 'raça', 'personalizado'],
    avoid: ['industrial', 'genérico', 'qualquer raça serve', 'sem diferenciação'],
    ctaStyle: 'Animado: "Agendar Banho e Tosa", "Ver Produtos", "Mimar Meu Pet"',
    socialProof: '"Pets sempre felizes" / "Profissionais apaixonados por animais" / "Avaliação 4.9★"',
  },
  academia: {
    voice: 'Motivador, energético e desafiador. Fala com quem quer resultados reais, sem enrolação.',
    vocabulary: ['resultado', 'transformação', 'superação', 'metas', 'treino', 'evolução', 'consistência', 'performance'],
    avoid: ['milagre', 'sem esforço', 'em pouco tempo', 'passivo'],
    ctaStyle: 'Motivador e urgente: "Começar Agora", "Quero Resultado", "Iniciar Minha Transformação"',
    socialProof: '"+ de 1.000 alunos ativos" / "Resultados comprovados" / "Instrutores certificados"',
  },
  imobiliaria: {
    voice: 'Confiável, especializado e sonhador. Ajuda o cliente a imaginar sua vida no imóvel.',
    vocabulary: ['oportunidade', 'valorização', 'localização', 'exclusivo', 'financiamento', 'investimento', 'sonho'],
    avoid: ['baratíssimo', 'urgente', 'última unidade toda semana', 'promoção suspeita'],
    ctaStyle: 'Consultivo: "Falar com Corretor", "Ver Imóveis Disponíveis", "Agendar Visita"',
    socialProof: '"+ de 500 famílias realizadas" / "CRECI ativo" / "20 anos no mercado"',
  },
  contabilidade: {
    voice: 'Sóbrio, técnico e parceiro de negócios. Passa segurança sem ser intimidador — o contador que explica as coisas.',
    vocabulary: ['regularização', 'economia tributária', 'enquadramento', 'obrigações', 'Simples Nacional', 'BPO'],
    avoid: ['complicado', 'impostos são difíceis', 'burocracia sem fim', 'missão impossível'],
    ctaStyle: 'Parceiro: "Solicitar Proposta", "Regularizar meu CNPJ", "Falar com Contador"',
    socialProof: '"+ de 200 empresas atendidas" / "Sem multas por atraso" / "Especialistas em MEI e ME"',
  },
  tecnologia: {
    voice: 'Moderno, direto e confiante. Fala de resultado, não de tecnologia pela tecnologia.',
    vocabulary: ['automatizar', 'escalar', 'integrar', 'eficiência', 'ROI', 'solução', 'sistema', 'performance'],
    avoid: ['blockchain sem contexto', 'disruptivo', 'revolucionário vazio', 'jargão sem tradução'],
    ctaStyle: 'Objetivo: "Solicitar Demo", "Ver Como Funciona", "Automatizar Meu Negócio"',
    socialProof: '"+ de 100 sistemas entregues" / "Uptime 99.9%" / "Suporte em menos de 4h"',
  },
  farmacia: {
    voice: 'Acolhedor, técnico e confiável. Combina expertise farmacêutica com atendimento humanizado.',
    vocabulary: ['medicamento', 'fórmula', 'prescrição', 'prevenção', 'bem-estar', 'cuidado', 'qualidade'],
    avoid: ['automedicação', 'sem receita', 'milagre', 'cura garantida'],
    ctaStyle: 'Acolhedor: "Consultar Disponibilidade", "Falar com Farmacêutico", "Fazer Meu Orçamento"',
    socialProof: '"Farmacêutico responsável presente" / "Produto com procedência" / "Preço justo sem enganação"',
  },
  turismo: {
    voice: 'Evocativo e acolhedor. Faz o cliente imaginar a experiência antes mesmo de reservar.',
    vocabulary: ['experiência', 'momentos', 'conforto', 'descanso', 'escapada', 'aconchegante', 'inesquecível'],
    avoid: ['hotel genérico', 'lugar qualquer', 'básico demais', 'sem diferenciais'],
    ctaStyle: 'Convidativo: "Ver Disponibilidade", "Reservar Agora", "Planejar Minha Viagem"',
    socialProof: '"Hóspedes que voltam todo ano" / "Nota 5 no Booking" / "Melhor localização da região"',
  },
  transporte: {
    voice: 'Direto, confiável e eficiente. Foco em pontualidade, segurança e facilidade de contratar.',
    vocabulary: ['no prazo', 'seguro', 'rastreado', 'coleta', 'entrega', 'frota', 'comprometido'],
    avoid: ['aventura', 'imprevisível', 'sem garantia', 'talvez chegue'],
    ctaStyle: 'Direto: "Solicitar Orçamento", "Agendar Coleta", "Cotar Frete"',
    socialProof: '"+ de 10.000 entregas realizadas" / "Seguro incluso" / "Rastreamento em tempo real"',
  },
  fotografia: {
    voice: 'Artístico, emocional e profissional. Fala de memórias, emoções e storytelling visual.',
    vocabulary: ['momento', 'eternizar', 'emoção', 'história', 'luz', 'enquadramento', 'autêntico', 'exclusivo'],
    avoid: ['foto qualquer', 'parecido com todos', 'preço de mercado', 'genérico'],
    ctaStyle: 'Inspirador: "Ver Portfolio", "Agendar Ensaio", "Eternizar Esse Momento"',
    socialProof: '"+ de 500 ensaios realizados" / "Eleito melhor fotógrafo" / "Clientes que choram de emoção"',
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

// ─── FEW-SHOT EXTRA SEGMENTS ─────────────────────────────────────────────────

Object.assign(FEW_SHOT_EXAMPLES, {
  veterinaria: `{
  "hero_subheadline": "Cuidado veterinário especializado em Vila Mariana com equipe apaixonada por animais.",
  "cta_main": "Agendar Consulta",
  "cta_sub": "Agenda aberta pelo WhatsApp agora",
  "services": [
    {"name": "Consultas Clínicas", "description": "Avaliação completa com veterinários especializados em pequenos animais, diagnóstico preciso e tratamento seguro.", "icon": "🩺"},
    {"name": "Vacinação e Preventivos", "description": "Protocolo vacinal atualizado para cães e gatos, com aplicação de antiparasitários e orientação ao tutor.", "icon": "💉"},
    {"name": "Banho e Tosa Profissional", "description": "Banho terapêutico com produtos hipoalergênicos e tosa profissional para todas as raças.", "icon": "✂️"}
  ],
  "footer_tagline": "Saúde e carinho para seu pet",
  "image_prompts": {
    "hero": "veterinário sorrindo examinando cachorro golden retriever",
    "gallery": ["filhote sendo vacinado com cuidado", "gato em consulta veterinária", "cachorro feliz após banho e tosa"],
    "catalog": "produtos veterinários e acessórios pet"
  },
  "seo_keywords": ["clínica veterinária", "veterinário", "consulta pet", "vacinação cão gato", "banho e tosa", "SP"]
}`,

  academia: `{
  "hero_subheadline": "Treinos personalizados em Pinheiros com instrutores certificados e resultados reais.",
  "cta_main": "Começar Agora",
  "cta_sub": "1ª aula grátis — venha treinar",
  "services": [
    {"name": "Musculação", "description": "Sala de musculação com equipamentos Technogym e instrutores formados para evolução constante.", "icon": "💪"},
    {"name": "Aulas em Grupo", "description": "Spinning, functional, zumba e HIIT em turmas pequenas para treinar com mais motivação.", "icon": "🏃"},
    {"name": "Personal Trainer", "description": "Treinos 100% personalizados com avaliação física, periodização e acompanhamento semanal.", "icon": "🎯"}
  ],
  "footer_tagline": "Sua melhor versão começa aqui",
  "image_prompts": {
    "hero": "academia moderna iluminada com alunos treinando",
    "gallery": ["personal trainer orientando aluno", "aula funcional em grupo animada", "sala de musculação com equipamentos"],
    "catalog": "equipamentos de musculação e fitness"
  },
  "seo_keywords": ["academia", "musculação", "personal trainer", "crossfit", "pilates", "Pinheiros SP"]
}`,

  imobiliaria: `{
  "hero_subheadline": "Encontre o imóvel ideal na Grande São Paulo com corretores que realmente conhecem cada bairro.",
  "cta_main": "Ver Imóveis",
  "cta_sub": "Fale agora com um corretor",
  "services": [
    {"name": "Compra e Venda", "description": "Consultoria completa na compra e venda de apartamentos e casas, do anúncio até as chaves na mão.", "icon": "🏠"},
    {"name": "Locação Residencial", "description": "Imóveis residenciais para locação com vistoria, contrato digital e gestão completa.", "icon": "🔑"},
    {"name": "Avaliação de Imóveis", "description": "Laudo de avaliação mercadológica para venda justa e valorização consciente do seu imóvel.", "icon": "📊"}
  ],
  "footer_tagline": "Seu imóvel, nossa missão",
  "image_prompts": {
    "hero": "apartamento moderno decorado sala de estar",
    "gallery": ["casa moderna com jardim", "interior apartamento cozinha integrada", "corretor mostrando imóvel a casal"],
    "catalog": "imóvel fachada moderna"
  },
  "seo_keywords": ["imobiliária", "apartamento à venda", "casa para alugar", "corretor de imóveis", "CRECI", "SP"]
}`,

  contabilidade: `{
  "hero_subheadline": "Escritório contábil em Santo André especializado em MEI, ME e empresas do ABC Paulista.",
  "cta_main": "Solicitar Proposta",
  "cta_sub": "Resposta em até 24h úteis",
  "services": [
    {"name": "Abertura de Empresa", "description": "Abertura de MEI, ME e LTDA com CNPJ, alvará e enquadramento no regime tributário ideal.", "icon": "📋"},
    {"name": "Contabilidade Mensal", "description": "Apuração de impostos, DAS, DCTF e obrigações acessórias sem atrasos ou multas.", "icon": "📊"},
    {"name": "Departamento Pessoal", "description": "Folha de pagamento, admissão, demissão, e-Social e FGTS para sua equipe.", "icon": "👥"}
  ],
  "footer_tagline": "Números certos, empresa forte",
  "image_prompts": {
    "hero": "contador trabalhando em documentos fiscais no computador",
    "gallery": ["reunião de planejamento tributário", "documentos contábeis organizados", "gráficos financeiros relatório"],
    "catalog": "documentos contábeis fiscais"
  },
  "seo_keywords": ["contabilidade", "contador", "abertura de empresa", "MEI", "Simples Nacional", "ABC Paulista"]
}`,

  tecnologia: `{
  "hero_subheadline": "Sistemas e aplicativos que automatizam rotinas e escalam seu negócio sem contratar mais.",
  "cta_main": "Ver Demo",
  "cta_sub": "Consultoria gratuita — sem compromisso",
  "services": [
    {"name": "Desenvolvimento de Sistema", "description": "Sistemas web e aplicativos mobile sob medida para automatizar processos e aumentar produtividade.", "icon": "💻"},
    {"name": "Suporte Técnico", "description": "Suporte remoto e presencial com SLA garantido, resolução em até 4 horas para problemas críticos.", "icon": "🛠️"},
    {"name": "Cloud e Infraestrutura", "description": "Migração para AWS/Google Cloud com backup automático, segurança e monitoramento 24/7.", "icon": "☁️"}
  ],
  "footer_tagline": "Tecnologia que gera resultado",
  "image_prompts": {
    "hero": "desenvolvedor trabalhando em múltiplos monitores com código",
    "gallery": ["equipe de tecnologia reunião", "dashboard sistema moderno", "servidor data center"],
    "catalog": "interface software dashboard moderno"
  },
  "seo_keywords": ["desenvolvimento de sistema", "software sob medida", "suporte técnico TI", "cloud AWS", "aplicativo", "SP"]
}`,

  farmacia: `{
  "hero_subheadline": "Farmácia de manipulação em Campinas com fórmulas personalizadas e atendimento farmacêutico de verdade.",
  "cta_main": "Ver Produtos",
  "cta_sub": "Orçamento pelo WhatsApp em minutos",
  "services": [
    {"name": "Medicamentos", "description": "Amplo estoque de medicamentos éticos, genéricos e similares das principais marcas com preço competitivo.", "icon": "💊"},
    {"name": "Manipulação", "description": "Fórmulas personalizadas com matérias-primas certificadas pela Anvisa, manipuladas sob supervisão farmacêutica.", "icon": "🧪"},
    {"name": "Dermocosméticos", "description": "Linha completa de cosméticos, fotoprotetores e produtos de higiene pessoal com orientação profissional.", "icon": "💆"}
  ],
  "footer_tagline": "Cuidar de você é nossa especialidade",
  "image_prompts": {
    "hero": "farmácia limpa organizada com farmacêutico no balcão",
    "gallery": ["prateleiras de medicamentos organizadas", "farmacêutico manipulando fórmula", "produtos dermocosméticos"],
    "catalog": "produtos farmácia saúde"
  },
  "seo_keywords": ["farmácia", "manipulação", "farmácia de manipulação", "dermocosméticos", "medicamentos", "Campinas SP"]
}`,

  turismo: `{
  "hero_subheadline": "Pousada à beira-mar em Ubatuba com chalés privativos, café da manhã caseiro e natureza preservada.",
  "cta_main": "Verificar Disponibilidade",
  "cta_sub": "Reserve direto, sem taxa de plataforma",
  "services": [
    {"name": "Acomodação", "description": "Chalés privativos com ar-condicionado, Wi-Fi, frigobar e varanda com vista para o jardim tropical.", "icon": "🏡"},
    {"name": "Café da Manhã", "description": "Café da manhã artesanal com frutas, pães caseiros, bolos e geleias produzidos na propriedade.", "icon": "☕"},
    {"name": "Passeios e Trilhas", "description": "Roteiros para praias selvagens, cachoeiras e mergulho com guias locais especializados.", "icon": "🗺️"}
  ],
  "footer_tagline": "Onde cada estadia vira memória",
  "image_prompts": {
    "hero": "chalé pousada tropical jardim vista natureza",
    "gallery": ["varanda chalé com rede hammock", "café da manhã caprichado mesa farta", "praia selvagem trilha natureza"],
    "catalog": "quarto pousada decoração acolhedora"
  },
  "seo_keywords": ["pousada Ubatuba", "chalé beira mar", "hotel ecológico", "férias litoral SP", "turismo Ubatuba"]
}`,

  fotografia: `{
  "hero_subheadline": "Fotógrafa de casamentos e ensaios em São Paulo — imagens que contam histórias com emoção e arte.",
  "cta_main": "Ver Portfolio",
  "cta_sub": "Datas disponíveis pelo WhatsApp",
  "services": [
    {"name": "Casamentos", "description": "Cobertura completa do seu grande dia, do getting ready à festa, em fotos e vídeo cinematográfico.", "icon": "💒"},
    {"name": "Ensaios Fotográficos", "description": "Ensaios de casal, família, gestante e newborn em estúdio ou locação ao ar livre em SP.", "icon": "📸"},
    {"name": "Corporativo", "description": "Fotos institucionais, headshots profissionais e conteúdo para redes sociais da sua empresa.", "icon": "🎬"}
  ],
  "footer_tagline": "Eternizando momentos que importam",
  "image_prompts": {
    "hero": "fotógrafa capturando casal feliz sessão externa",
    "gallery": ["casal casamento cerimônia emoção", "ensaio família parque ao ar livre", "foto corporativa profissional headshot"],
    "catalog": "câmera profissional equipamento estúdio"
  },
  "seo_keywords": ["fotógrafa de casamentos", "ensaio fotográfico SP", "foto newborn", "fotógrafo corporativo", "São Paulo"]
}`,
});

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
