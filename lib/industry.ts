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
    id: 'veterinaria',
    label: 'Clínica Veterinária',
    keywords: ['veterinário', 'veterinario', 'veterinária', 'veterinaria', 'clínica veterinária', 'pet', 'animal', 'cachorro', 'cão', 'cao', 'gato', 'banho e tosa', 'tosa', 'ração', 'racao', 'vacina', 'castracao', 'castração', 'zoonose', 'adestramento'],
    template: 'farmacy',
    fallbackServices: [
      { icon: '🐾', name: 'Consultas Veterinárias', description: 'Atendimento clínico completo com veterinários especializados para seu pet.' },
      { icon: '💉', name: 'Vacinação e Prevenção', description: 'Protocolo vacinal atualizado e preventivos contra parasitas internos e externos.' },
      { icon: '✂️', name: 'Banho e Tosa', description: 'Banho, tosa e hidratação com produtos premium para o seu animal de estimação.' },
    ],
    fallbackHeadline: 'Cuidado especializado para o seu melhor amigo',
    fallbackCTA: 'Agendar Consulta',
    fallbackCTASub: 'Agende pelo WhatsApp agora',
    fallbackTagline: 'Saúde e amor para seu pet',
    imagePrompt: 'veterinário atendendo cachorro em consultório moderno',
    galleryPrompts: [
      'veterinário examinando pet com cuidado',
      'cachorro sendo preparado para banho e tosa',
      'gato sendo vacinado com segurança',
    ],
  },
  {
    id: 'petshop',
    label: 'Pet Shop',
    keywords: ['petshop', 'pet shop', 'loja de animais', 'aquário', 'pássaro', 'passaro', 'hamster', 'ração pet', 'acessórios pet', 'coleira', 'brinquedo pet', 'aquarium'],
    template: 'store',
    fallbackServices: [
      { icon: '🛁', name: 'Banho e Tosa', description: 'Banho completo com produtos premium e tosa profissional para todas as raças.' },
      { icon: '🛒', name: 'Produtos e Rações', description: 'Linha completa de rações, petiscos e acessórios das melhores marcas.' },
      { icon: '🐶', name: 'Adestramento', description: 'Sessões de adestramento positivo para cães de todas as idades e raças.' },
    ],
    fallbackHeadline: 'Tudo que o seu pet precisa em um só lugar',
    fallbackCTA: 'Ver Produtos',
    fallbackCTASub: 'Agende banho e tosa pelo WhatsApp',
    fallbackTagline: 'Felicidade animal desde o primeiro dia',
    imagePrompt: 'pet shop colorido com prateleiras de produtos pet',
    galleryPrompts: ['cachorro feliz após banho e tosa', 'prateleiras com rações premium', 'acessórios e brinquedos para pets'],
  },
  {
    id: 'academia',
    label: 'Academia e Fitness',
    keywords: ['academia', 'gym', 'fitness', 'crossfit', 'musculação', 'musculacao', 'personal trainer', 'personal', 'funcional', 'aeróbico', 'aerobico', 'spinning', 'zumba', 'boxe', 'muay thai', 'jiu-jitsu', 'judô', 'judo', 'karatê', 'karate', 'pilates', 'yoga', 'natação', 'natacao'],
    template: 'restaurant',
    fallbackServices: [
      { icon: '💪', name: 'Musculação', description: 'Equipamentos modernos e instrutores qualificados para seu desenvolvimento físico.' },
      { icon: '🏃', name: 'Aulas em Grupo', description: 'Turmas de funcional, spinning, zumba e muito mais para tornar o treino divertido.' },
      { icon: '🎯', name: 'Personal Trainer', description: 'Treinos personalizados com acompanhamento individual para resultados mais rápidos.' },
    ],
    fallbackHeadline: 'Transforme seu corpo e sua vida com quem entende de resultado',
    fallbackCTA: 'Começar Agora',
    fallbackCTASub: 'Primeira aula grátis — sem compromisso',
    fallbackTagline: 'Força, saúde e superação todos os dias',
    imagePrompt: 'academia moderna com equipamentos de musculação',
    galleryPrompts: ['aluno treinando com instrutor', 'sala de aula em grupo animada', 'equipamentos modernos de musculação'],
  },
  {
    id: 'imobiliaria',
    label: 'Imobiliária e Corretagem',
    keywords: ['imobiliária', 'imobiliaria', 'corretor', 'imóvel', 'imovel', 'apartamento', 'casa', 'aluguel', 'venda de imóveis', 'lançamento', 'loteamento', 'terreno', 'condomínio', 'condominio', 'real estate'],
    template: 'portfolio',
    fallbackServices: [
      { icon: '🏠', name: 'Compra e Venda', description: 'Consultoria completa na compra e venda de imóveis residenciais e comerciais.' },
      { icon: '🔑', name: 'Locação', description: 'Administração de imóveis para locação com gestão contratual e financeira.' },
      { icon: '📊', name: 'Avaliação de Imóveis', description: 'Laudo técnico de avaliação mercadológica com análise de valorização.' },
    ],
    fallbackHeadline: 'O imóvel dos seus sonhos está a um passo',
    fallbackCTA: 'Ver Imóveis',
    fallbackCTASub: 'Fale com um corretor agora',
    fallbackTagline: 'Seu lar, nossa missão',
    imagePrompt: 'casa moderna e bem decorada com jardim',
    galleryPrompts: ['interior de apartamento decorado', 'fachada de casa nova', 'contrato sendo assinado'],
  },
  {
    id: 'contabilidade',
    label: 'Contabilidade e Finanças',
    keywords: ['contabilidade', 'contábil', 'contabil', 'contador', 'contadora', 'bpo', 'fiscal', 'tributário', 'tributario', 'imposto', 'irpf', 'irpj', 'simples nacional', 'mei', 'declaração', 'declaracao', 'balancete', 'folha de pagamento', 'rh', 'recursos humanos'],
    template: 'portfolio',
    fallbackServices: [
      { icon: '📑', name: 'Contabilidade Fiscal', description: 'Apuração de impostos, declarações e obrigações acessórias no prazo certo.' },
      { icon: '👥', name: 'Departamento Pessoal', description: 'Folha de pagamento, admissão, demissão e e-Social sem complicações.' },
      { icon: '📊', name: 'Planejamento Tributário', description: 'Redução legal da carga tributária com enquadramento no regime ideal.' },
    ],
    fallbackHeadline: 'Sua empresa em dia, seus impostos sob controle',
    fallbackCTA: 'Solicitar Proposta',
    fallbackCTASub: 'Atendemos MEI, ME e empresas de médio porte',
    fallbackTagline: 'Números certos, empresa forte',
    imagePrompt: 'contador trabalhando com documentos e computador',
    galleryPrompts: ['reunião de planejamento financeiro', 'documentos fiscais organizados', 'gráficos e relatórios financeiros'],
  },
  {
    id: 'tecnologia',
    label: 'Tecnologia e TI',
    keywords: ['tecnologia', 'ti', 'informática', 'informatica', 'software', 'sistema', 'aplicativo', 'app', 'desenvolvimento', 'programação', 'programacao', 'suporte técnico', 'suporte tecnico', 'hardware', 'rede', 'servidor', 'cloud', 'nuvem', 'cibersegurança', 'ciberseguranca', 'automação', 'automacao', 'erp', 'crm'],
    template: 'portfolio',
    fallbackServices: [
      { icon: '💻', name: 'Desenvolvimento de Software', description: 'Sistemas e aplicativos personalizados para automatizar e escalar seu negócio.' },
      { icon: '🛠️', name: 'Suporte Técnico', description: 'Atendimento rápido remoto e presencial para manter sua empresa operando.' },
      { icon: '☁️', name: 'Infraestrutura e Cloud', description: 'Migração para nuvem, servidores e segurança da informação com SLA garantido.' },
    ],
    fallbackHeadline: 'Tecnologia que acelera o seu negócio',
    fallbackCTA: 'Solicitar Demo',
    fallbackCTASub: 'Consultoria gratuita sem compromisso',
    fallbackTagline: 'Inovação que transforma resultados',
    imagePrompt: 'desenvolvedor trabalhando em código em monitor',
    galleryPrompts: ['equipe de TI em reunião', 'servidor e infraestrutura de rede', 'dashboard de sistema moderno'],
  },
  {
    id: 'farmacia',
    label: 'Farmácia e Drogaria',
    keywords: ['farmácia', 'farmacia', 'drogaria', 'remédio', 'remedio', 'medicamento', 'manipulação', 'manipulacao', 'vitamina', 'suplemento', 'dermocosméticos', 'cosméticos', 'cosmeticos', 'perfumaria', 'homeopática', 'homeopatica'],
    template: 'farmacy',
    fallbackServices: [
      { icon: '💊', name: 'Medicamentos', description: 'Amplo estoque de medicamentos éticos, genéricos e similares com preço justo.' },
      { icon: '🧪', name: 'Manipulação', description: 'Fórmulas personalizadas manipuladas com rigor técnico e matérias-primas certificadas.' },
      { icon: '💆', name: 'Dermocosméticos', description: 'Linha completa de cosméticos, perfumaria e produtos de higiene das melhores marcas.' },
    ],
    fallbackHeadline: 'Saúde e bem-estar com confiança e economia',
    fallbackCTA: 'Consultar Preço',
    fallbackCTASub: 'Entrega rápida pelo WhatsApp',
    fallbackTagline: 'Cuidar de você é nossa especialidade',
    imagePrompt: 'farmácia organizada com balcão de atendimento',
    galleryPrompts: ['prateleiras de medicamentos organizadas', 'farmacêutico atendendo cliente', 'produtos de dermocosméticos'],
  },
  {
    id: 'turismo',
    label: 'Turismo e Hospitalidade',
    keywords: ['pousada', 'hotel', 'hostel', 'turismo', 'viagem', 'viagens', 'agência de viagem', 'agencia de viagem', 'resort', 'chalé', 'chale', 'quarto', 'hospedagem', 'excursão', 'excursao', 'pacote', 'turístico', 'turistico', 'ecoturismo'],
    template: 'restaurant',
    fallbackServices: [
      { icon: '🏨', name: 'Acomodação', description: 'Quartos e suítes confortáveis com café da manhã, Wi-Fi e estrutura completa.' },
      { icon: '🗺️', name: 'Pacotes e Excursões', description: 'Roteiros exclusivos com guia especializado para os melhores destinos.' },
      { icon: '🛎️', name: 'Serviços Completos', description: 'Transfer, passeios, gastronomia local e atendimento personalizado 24h.' },
    ],
    fallbackHeadline: 'Momentos inesquecíveis começam aqui',
    fallbackCTA: 'Ver Disponibilidade',
    fallbackCTASub: 'Reserve agora pelo WhatsApp',
    fallbackTagline: 'Onde cada estadia vira memória',
    imagePrompt: 'pousada aconchegante com vista para a natureza',
    galleryPrompts: ['quarto decorado de pousada', 'área de lazer e piscina', 'café da manhã caprichado'],
  },
  {
    id: 'transporte',
    label: 'Transporte e Logística',
    keywords: ['transporte', 'transportadora', 'logística', 'logistica', 'mudança', 'mudanca', 'frete', 'caminhão', 'caminhao', 'entrega', 'motoboy', 'moto', 'courier', 'expresso', 'carga', 'frota'],
    template: 'farmacy',
    fallbackServices: [
      { icon: '🚛', name: 'Frete e Mudança', description: 'Transporte de móveis e equipamentos com equipe especializada e seguro.' },
      { icon: '📦', name: 'Entrega Expressa', description: 'Coleta e entrega no mesmo dia para sua região com rastreamento em tempo real.' },
      { icon: '🏭', name: 'Logística Empresarial', description: 'Soluções de armazenagem e distribuição para empresas de todos os portes.' },
    ],
    fallbackHeadline: 'Seu frete no prazo, sem complicação',
    fallbackCTA: 'Solicitar Orçamento',
    fallbackCTASub: 'Orçamento em minutos pelo WhatsApp',
    fallbackTagline: 'Carga segura, entrega garantida',
    imagePrompt: 'caminhão de transporte em rodovia',
    galleryPrompts: ['equipe carregando mudança com cuidado', 'armazém logístico organizado', 'entregador com pacote'],
  },
  {
    id: 'fotografia',
    label: 'Fotografia e Audiovisual',
    keywords: ['fotógrafo', 'fotografo', 'fotografia', 'filmagem', 'vídeo', 'video', 'estúdio', 'studio', 'ensaio', 'casamento', 'evento', 'corporativo', 'publicidade', 'drone', 'retratos', 'newborn', 'gestante', 'edição', 'edicao'],
    template: 'portfolio',
    fallbackServices: [
      { icon: '📸', name: 'Ensaios Fotográficos', description: 'Ensaios artísticos em estúdio ou locação para retratos únicos e memoráveis.' },
      { icon: '💒', name: 'Casamentos e Eventos', description: 'Cobertura fotográfica e filmagem completa do seu dia especial.' },
      { icon: '🎬', name: 'Vídeo Corporativo', description: 'Produção de vídeos institucionais e publicitários para sua marca.' },
    ],
    fallbackHeadline: 'Histórias reais capturadas com arte e emoção',
    fallbackCTA: 'Ver Portfolio',
    fallbackCTASub: 'Agende seu ensaio pelo WhatsApp',
    fallbackTagline: 'Momentos eternizados em cada clique',
    imagePrompt: 'fotógrafo em ensaio com câmera profissional',
    galleryPrompts: ['ensaio fotográfico artístico', 'casamento fotografado com emoção', 'foto corporativa profissional'],
  },
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
    id: 'generico',
    label: 'Genérico',
    keywords: [],
    template: 'portfolio',
    fallbackServices: [
      { icon: '⭐', name: 'Serviço Principal', description: 'Conheça nossos serviços profissionais de alta qualidade.' },
      { icon: '📞', name: 'Atendimento Personalizado', description: 'Suporte direto e personalizado para cada cliente.' },
      { icon: '💡', name: 'Soluções Sob Medida', description: 'Soluções adaptadas às necessidades específicas do seu negócio.' },
    ],
    fallbackHeadline: 'Soluções profissionais para o seu negócio',
    fallbackCTA: 'Fale Conosco',
    fallbackCTASub: 'Solicite um orçamento agora mesmo',
    fallbackTagline: 'Excelência em serviços',
    imagePrompt: 'escritório profissional moderno e iluminado',
    galleryPrompts: [
      'equipe trabalhando em escritório moderno',
      'reunião de negócios em sala corporativa',
      'detalhes de ambiente profissional',
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

  let bestMatch = INDUSTRIES.find(i => i.id === 'generico') ?? INDUSTRIES[0];
  let bestScore = 0;
  const MIN_SCORE = 5; // minimum score to consider a match valid

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

  return bestScore >= MIN_SCORE ? bestMatch : (INDUSTRIES.find(i => i.id === 'generico') ?? bestMatch);
}

export function getIndustryById(id: string): IndustryInfo | undefined {
  return INDUSTRIES.find(i => i.id === id);
}

export function getIndustryKeywords(id: string): string[] {
  const industry = getIndustryById(id);
  return industry?.keywords ?? [];
}

export function validateAIContent(ai: { services: { name: string; description: string }[] }, industry: IndustryInfo): boolean {
  if (!ai?.services || ai.services.length === 0) return false;

  // For unknown segments, trust the AI — keyword validation would always fail (no keywords defined)
  if (industry.id === 'generico') return true;

  const industryKeywordsLower = industry.keywords.map(k => k.toLowerCase());

  const allServiceText = ai.services.map(s =>
    `${s.name} ${s.description}`.toLowerCase()
  ).join(' ');

  const matchCount = industryKeywordsLower.filter(kw =>
    allServiceText.includes(kw) || industry.fallbackServices.some(fs =>
      fs.name.toLowerCase().includes(kw)
    )
  ).length;

  // At least 2 keyword matches from the industry
  const threshold = 2;
  const matches = matchCount >= threshold;

  if (!matches) return false;

  // Also check that services are NOT from a clearly different industry
  const otherIndustries = INDUSTRIES.filter(i => i.id !== industry.id && i.id !== 'generico');
  let otherMatchCount = 0;
  for (const other of otherIndustries) {
    const otherKeywords = other.keywords.map(k => k.toLowerCase());
    const hits = otherKeywords.filter(kw => allServiceText.includes(kw)).length;
    if (hits > otherMatchCount) otherMatchCount = hits;
  }

  // If another industry has MORE keyword matches than ours, reject
  return matchCount > otherMatchCount;
}
