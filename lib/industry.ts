export type IndustryId = string;

export type IndustryInfo = {
  id: IndustryId;
  label: string;
  keywords: string[];
  template: string;
  fallbackServices: { icon: string; name: string; description: string }[];
  fallbackHeadline: string;
  fallbackCTA: string;
  fallbackCTASub: string;
  fallbackTagline: string;
  imagePrompt: string;
  galleryPrompts: string[];
};

const INDUSTRIES: IndustryInfo[] = [
  {
    id: 'mecanica',
    label: 'Mecânica e Auto',
    keywords: ['mecânica', 'mecanica', 'oficina', 'auto', 'carros', 'automotivo', 'escapamento', 'pneus', 'alinhamento', 'suspensão', 'suspensao', 'troca de óleo', 'oleo', 'revisão', 'revisao', 'funilaria', 'pintura', 'estética automotiva', 'elétrica automotiva', 'eletrica automotiva', 'baterias', 'freios', 'embreagem', 'motor', 'injeção', 'injetora'],
    template: 'farmacy',
    fallbackServices: [
      { icon: '🔧', name: 'Reparo Mecânico', description: 'Diagnóstico e reparo completo de motores, câmbio, suspensão e freios.' },
      { icon: '🛞', name: 'Alinhamento e Balanceamento', description: 'Alinhamento 3D, balanceamento eletrônico e cambagem para seu veículo.' },
      { icon: '🔩', name: 'Troca de Óleo e Filtros', description: 'Troca rápida com óleos de alta qualidade e filtros originais.' },
    ],
    fallbackHeadline: 'Mecânica especializada que cuida do seu carro como se fosse nosso',
    fallbackCTA: 'Solicitar Orçamento',
    fallbackCTASub: 'Orçamento rápido e sem compromisso',
    fallbackTagline: 'Confiança que move seu carro',
    imagePrompt: 'oficina mecânica limpa e organizada com carro em elevador',
    galleryPrompts: [
      'carro sendo reparado por mecânico em oficina',
      'peças automotivas novas em bancada',
      'diagnóstico computadorizado em veículo',
    ],
  },
  {
    id: 'restaurante',
    label: 'Restaurante e Gastronomia',
    keywords: ['restaurante', 'pizzaria', 'lanchonete', 'bar', 'petiscaria', 'comida', 'gastronomia', 'chef', 'cardápio', 'cardapio', 'delivery', 'entregas', 'almoço', 'almoco', 'jantar', 'self-service', 'churrascaria', 'esfiharia', 'creperia', 'sorveteria', 'cafeteria', 'padaria', 'confeitaria'],
    template: 'restaurant',
    fallbackServices: [
      { icon: '🍕', name: 'Pratos Especiais', description: 'Receitas exclusivas preparadas com ingredientes frescos e selecionados.' },
      { icon: '🚀', name: 'Delivery Rápido', description: 'Entrega no conforto da sua casa com agilidade e segurança.' },
      { icon: '🎉', name: 'Eventos e Festas', description: 'Buffet personalizado para eventos corporativos e comemorações.' },
    ],
    fallbackHeadline: 'Sabor autêntico que conquista paladares exigentes',
    fallbackCTA: 'Fazer Pedido',
    fallbackCTASub: 'Peça já pelo WhatsApp',
    fallbackTagline: 'Sabor que alimenta a alma',
    imagePrompt: 'prato de comida brasileira bem servido em mesa decorada',
    galleryPrompts: [
      'prato principal decorado com ervas frescas',
      'interior de restaurante aconchegante',
      'chef preparando prato na cozinha',
    ],
  },
  {
    id: 'clinica',
    label: 'Clínica e Saúde',
    keywords: ['clínica', 'clinica', 'consultório', 'consultorio', 'médico', 'medico', 'dentista', 'saúde', 'saude', 'fisioterapia', 'psicologia', 'nutrição', 'nutricao', 'estética', 'estetica', 'bem-estar', 'bem estar', 'terapia', 'fonoaudiologia', 'acupuntura', 'massagem', 'pilates'],
    template: 'farmacy',
    fallbackServices: [
      { icon: '🩺', name: 'Consulta Especializada', description: 'Atendimento humanizado com profissionais qualificados e experientes.' },
      { icon: '📅', name: 'Agendamento Online', description: 'Marque sua consulta pelo WhatsApp de forma rápida e prática.' },
      { icon: '💚', name: 'Acompanhamento Personalizado', description: 'Plano de tratamento individualizado para cada paciente.' },
    ],
    fallbackHeadline: 'Cuidado humanizado que transforma vidas',
    fallbackCTA: 'Agendar Consulta',
    fallbackCTASub: 'Agende agora pelo WhatsApp',
    fallbackTagline: 'Saúde e bem-estar em primeiro lugar',
    imagePrompt: 'consultório médico moderno e acolhedor',
    galleryPrompts: [
      'sala de atendimento com equipamentos modernos',
      'profissional atendendo paciente com cuidado',
      'recepção aconchegante de clínica',
    ],
  },
  {
    id: 'loja',
    label: 'Loja e Comércio',
    keywords: ['loja', 'comércio', 'comercio', 'e-commerce', 'ecommerce', 'produtos', 'varejo', 'atacado', 'boutique', 'presentes', 'acessórios', 'acessorios', 'moda', 'roupas', 'calçados', 'calcados', 'joias', 'bijuterias', 'artesanato', 'decoração', 'decoracao'],
    template: 'store',
    fallbackServices: [
      { icon: '🚚', name: 'Entrega Rápida', description: 'Envio ágil para toda região com rastreamento em tempo real.' },
      { icon: '✅', name: 'Qualidade Garantida', description: 'Produtos selecionados com procedência e garantia de satisfação.' },
      { icon: '💬', name: 'Atendimento Personalizado', description: 'Suporte direto pelo WhatsApp para dúvidas e pedidos especiais.' },
    ],
    fallbackHeadline: 'Produtos selecionados para você',
    fallbackCTA: 'Ver Produtos',
    fallbackCTASub: 'Confira nosso catálogo completo',
    fallbackTagline: 'Qualidade que você merece',
    imagePrompt: 'vitrine de loja com produtos organizados',
    galleryPrompts: [
      'produtos em exposição em prateleiras',
      'cliente sendo atendido em loja',
      'embalagem de presente personalizada',
    ],
  },
  {
    id: 'advocacia',
    label: 'Advocacia e Direito',
    keywords: ['advocacia', 'advogado', 'escritório de advocacia', 'escritorio', 'direito', 'jurídico', 'juridico', 'trabalhista', 'cível', 'civil', 'previdenciário', 'previdenciario', 'tributário', 'tributario', 'imobiliário', 'imobiliario', 'empresarial', 'contratos'],
    template: 'portfolio',
    fallbackServices: [
      { icon: '⚖️', name: 'Consultoria Jurídica', description: 'Análise completa do seu caso com orientação jurídica especializada.' },
      { icon: '📝', name: 'Elaboração de Contratos', description: 'Contratos personalizados com segurança jurídica para seu negócio.' },
      { icon: '🔍', name: 'Acompanhamento Processual', description: 'Acompanhamento de processos com atualizações periódicas ao cliente.' },
    ],
    fallbackHeadline: 'Solução jurídica com excelência e confiança',
    fallbackCTA: 'Solicitar Consulta',
    fallbackCTASub: 'Agende sua consulta agora',
    fallbackTagline: 'Seu direito em boas mãos',
    imagePrompt: 'escritório de advocacia com livros e mesa',
    galleryPrompts: [
      'biblioteca jurídica com livros de direito',
      'reunião em escritório profissional',
      'vista de tribunal ou fórum',
    ],
  },
  {
    id: 'beleza',
    label: 'Beleza e Estética',
    keywords: ['salão', 'salao', 'beleza', 'cabelo', 'cabeleireiro', 'manicure', 'pedicure', 'estética', 'estetica', 'depilação', 'depilacao', 'sobrancelha', 'unhas', 'makeup', 'maquiagem', 'barbearia', 'barbeiro', 'spa', 'massagem', 'designer', 'sombrancelha'],
    template: 'restaurant',
    fallbackServices: [
      { icon: '💇‍♀️', name: 'Corte e Penteados', description: 'Tendências em cortes femininos e masculinos com finalização profissional.' },
      { icon: '💅', name: 'Manicure e Pedicure', description: 'Unhas impecáveis com esmaltes de alta durabilidade e higiene.' },
      { icon: '✨', name: 'Tratamentos Capilares', description: 'Hidratação, botox capilar e reconstrução para cabelos saudáveis.' },
    ],
    fallbackHeadline: 'Sua beleza realçada por profissionais apaixonados',
    fallbackCTA: 'Agendar Horário',
    fallbackCTASub: 'Marque pelo WhatsApp',
    fallbackTagline: 'Beleza que transforma',
    imagePrompt: 'salão de beleza moderno e iluminado',
    galleryPrompts: [
      'corte de cabelo sendo finalizado',
      'unhas decoradas com design',
      'produtos profissionais de beleza',
    ],
  },
  {
    id: 'construcao',
    label: 'Construção e Reforma',
    keywords: ['construção', 'construcao', 'reforma', 'pedreiro', 'arquiteto', 'engenheiro', 'engenharia', 'arquitetura', 'design de interiores', 'decoração', 'decoracao', 'obra', 'projeto', 'elétrica', 'eletrica', 'encanamento', 'pintor', 'marcenaria', 'marceneiro'],
    template: 'portfolio',
    fallbackServices: [
      { icon: '🏗️', name: 'Projetos e Plantas', description: 'Projetos arquitetônicos completos com aprovação na prefeitura.' },
      { icon: '🔨', name: 'Reformas Residenciais', description: 'Reforma com qualidade, prazo e orçamento transparente.' },
      { icon: '📐', name: 'Design de Interiores', description: 'Ambientes planejados que combinam estética e funcionalidade.' },
    ],
    fallbackHeadline: 'Transformamos seus sonhos em projetos reais',
    fallbackCTA: 'Solicitar Orçamento',
    fallbackCTASub: 'Orçamento sem compromisso',
    fallbackTagline: 'Construindo seus sonhos',
    imagePrompt: 'obra ou construção moderna com equipamentos',
    galleryPrompts: [
      'projeto arquitetônico em planta',
      'ambiente reformado e decorado',
      'equipe trabalhando em obra',
    ],
  },
  {
    id: 'educacao',
    label: 'Educação e Cursos',
    keywords: ['escola', 'curso', 'educação', 'educacao', 'aula', 'professor', 'treinamento', 'ensino', 'idiomas', 'reforço', 'reforco', 'academia', 'matemática', 'matematica', 'português', 'portugues', 'pré-vestibular', 'pre-vestibular', 'concursos', 'ead', 'online'],
    template: 'portfolio',
    fallbackServices: [
      { icon: '📚', name: 'Cursos e Aulas', description: 'Metodologia moderna com professores qualificados e material didático exclusivo.' },
      { icon: '🎯', name: 'Acompanhamento Individual', description: 'Aulas personalizadas focadas nas necessidades de cada aluno.' },
      { icon: '🏆', name: 'Preparatório para Concursos', description: 'Preparação completa com simulados e material atualizado.' },
    ],
    fallbackHeadline: 'Educação que transforma o futuro',
    fallbackCTA: 'Matricule-se Já',
    fallbackCTASub: 'Vagas limitadas para turmas novas',
    fallbackTagline: 'Conhecimento que abre portas',
    imagePrompt: 'sala de aula moderna com alunos',
    galleryPrompts: [
      'professor explicando matéria no quadro',
      'alunos estudando em grupo',
      'biblioteca ou espaço de estudo',
    ],
  },
];

export function detectIndustry(businessName: string, description: string): IndustryInfo {
  const text = `${businessName} ${description}`.toLowerCase();

  let bestMatch = INDUSTRIES[0]; // default to first
  let bestScore = 0;

  for (const industry of INDUSTRIES) {
    let score = 0;
    for (const keyword of industry.keywords) {
      if (text.includes(keyword)) {
        score += keyword.length; // longer keywords = more specific matches
      }
    }
    // Boost score if keyword appears in business name specifically
    const nameLower = businessName.toLowerCase();
    for (const keyword of industry.keywords) {
      if (nameLower.includes(keyword)) {
        score += keyword.length * 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = industry;
    }
  }

  return bestMatch;
}

export function getIndustryById(id: string): IndustryInfo | undefined {
  return INDUSTRIES.find(i => i.id === id);
}

export function getIndustryKeywords(id: string): string[] {
  const industry = getIndustryById(id);
  return industry?.keywords ?? [];
}
