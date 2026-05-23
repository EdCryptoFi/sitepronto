-- ═══════════════════════════════════════════════════════════════════════════════
-- CONTEXT ENGINE — Supabase setup
-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. site_contexts: cada linha = uma indústria com contexto completo
CREATE TABLE IF NOT EXISTS site_contexts (
  id                TEXT PRIMARY KEY,
  label             TEXT NOT NULL,
  keywords          TEXT[] NOT NULL DEFAULT '{}',
  embedding         vector(768),                -- Gemini embedding-001
  template          TEXT NOT NULL DEFAULT 'portfolio',
  fallback_services JSONB,
  fallback_headline TEXT,
  fallback_cta      TEXT,
  fallback_cta_sub  TEXT,
  fallback_tagline  TEXT,
  image_prompt      TEXT,
  gallery_prompts   TEXT[],
  tone_guidelines   JSONB,                      -- { voice, vocabulary[], avoid[], ctaStyle, socialProof }
  few_shot_examples JSONB,                      -- [ { services[], headline, cta } ]
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seed data from existing lib/industry.ts
INSERT INTO site_contexts (id, label, keywords, template, fallback_services, fallback_headline, fallback_cta, fallback_cta_sub, fallback_tagline, image_prompt, gallery_prompts) VALUES

('mecanica', 'Mecânica e Auto',
  ARRAY['mecânica','mecanica','oficina','auto','carros','automotivo','escapamento','pneus','alinhamento','suspensão','suspensao','troca de óleo','oleo','revisão','revisao','funilaria','pintura','estética automotiva','elétrica automotiva','eletrica automotiva','baterias','freios','embreagem','motor','injeção','injetora'],
  'farmacy',
  '[{"icon":"🔧","name":"Reparo Mecânico","description":"Diagnóstico e reparo completo de motores, câmbio, suspensão e freios."},{"icon":"🛞","name":"Alinhamento e Balanceamento","description":"Alinhamento 3D, balanceamento eletrônico e cambagem para seu veículo."},{"icon":"🔩","name":"Troca de Óleo e Filtros","description":"Troca rápida com óleos de alta qualidade e filtros originais."}]',
  'Mecânica especializada que cuida do seu carro como se fosse nosso',
  'Solicitar Orçamento', 'Orçamento rápido e sem compromisso', 'Confiança que move seu carro',
  'oficina mecânica limpa e organizada com carro em elevador',
  ARRAY['carro sendo reparado por mecânico em oficina','peças automotivas novas em bancada','diagnóstico computadorizado em veículo']
),

('restaurante', 'Restaurante e Gastronomia',
  ARRAY['restaurante','pizzaria','lanchonete','bar','petiscaria','comida','gastronomia','chef','cardápio','cardapio','delivery','entregas','almoço','almoco','jantar','self-service','churrascaria','esfiharia','creperia','sorveteria','cafeteria','padaria','confeitaria'],
  'restaurant',
  '[{"icon":"🍕","name":"Pratos Especiais","description":"Receitas exclusivas preparadas com ingredientes frescos e selecionados."},{"icon":"🚀","name":"Delivery Rápido","description":"Entrega no conforto da sua casa com agilidade e segurança."},{"icon":"🎉","name":"Eventos e Festas","description":"Buffet personalizado para eventos corporativos e comemorações."}]',
  'Sabor autêntico que conquista paladares exigentes',
  'Fazer Pedido', 'Peça já pelo WhatsApp', 'Sabor que alimenta a alma',
  'prato de comida brasileira bem servido em mesa decorada',
  ARRAY['prato principal decorado com ervas frescas','interior de restaurante aconchegante','chef preparando prato na cozinha']
),

('clinica', 'Clínica e Saúde',
  ARRAY['clínica','clinica','consultório','consultorio','médico','medico','dentista','saúde','saude','fisioterapia','psicologia','nutrição','nutricao','estética','estetica','bem-estar','bem estar','terapia','fonoaudiologia','acupuntura','massagem','pilates'],
  'farmacy',
  '[{"icon":"🩺","name":"Consulta Especializada","description":"Atendimento humanizado com profissionais qualificados e experientes."},{"icon":"📅","name":"Agendamento Online","description":"Marque sua consulta pelo WhatsApp de forma rápida e prática."},{"icon":"💚","name":"Acompanhamento Personalizado","description":"Plano de tratamento individualizado para cada paciente."}]',
  'Cuidado humanizado que transforma vidas',
  'Agendar Consulta', 'Agende agora pelo WhatsApp', 'Saúde e bem-estar em primeiro lugar',
  'consultório médico moderno e acolhedor',
  ARRAY['sala de atendimento com equipamentos modernos','profissional atendendo paciente com cuidado','recepção aconchegante de clínica']
),

('loja', 'Loja e Comércio',
  ARRAY['loja','comércio','comercio','e-commerce','ecommerce','produtos','varejo','atacado','boutique','presentes','acessórios','acessorios','moda','roupas','calçados','calcados','joias','bijuterias','artesanato','decoração','decoracao'],
  'store',
  '[{"icon":"🚚","name":"Entrega Rápida","description":"Envio ágil para toda região com rastreamento em tempo real."},{"icon":"✅","name":"Qualidade Garantida","description":"Produtos selecionados com procedência e garantia de satisfação."},{"icon":"💬","name":"Atendimento Personalizado","description":"Suporte direto pelo WhatsApp para dúvidas e pedidos especiais."}]',
  'Produtos selecionados para você',
  'Ver Produtos', 'Confira nosso catálogo completo', 'Qualidade que você merece',
  'vitrine de loja com produtos organizados',
  ARRAY['produtos em exposição em prateleiras','cliente sendo atendido em loja','embalagem de presente personalizada']
),

('advocacia', 'Advocacia e Direito',
  ARRAY['advocacia','advogado','escritório de advocacia','escritorio','direito','jurídico','juridico','trabalhista','cível','civil','previdenciário','previdenciario','tributário','tributario','imobiliário','imobiliario','empresarial','contratos'],
  'portfolio',
  '[{"icon":"⚖️","name":"Consultoria Jurídica","description":"Análise completa do seu caso com orientação jurídica especializada."},{"icon":"📝","name":"Elaboração de Contratos","description":"Contratos personalizados com segurança jurídica para seu negócio."},{"icon":"🔍","name":"Acompanhamento Processual","description":"Acompanhamento de processos com atualizações periódicas ao cliente."}]',
  'Solução jurídica com excelência e confiança',
  'Solicitar Consulta', 'Agende sua consulta agora', 'Seu direito em boas mãos',
  'escritório de advocacia com livros e mesa',
  ARRAY['biblioteca jurídica com livros de direito','reunião em escritório profissional','vista de tribunal ou fórum']
),

('beleza', 'Beleza e Estética',
  ARRAY['salão','salao','beleza','cabelo','cabeleireiro','manicure','pedicure','estética','estetica','depilação','depilacao','sobrancelha','unhas','makeup','maquiagem','barbearia','barbeiro','spa','massagem','designer','sombrancelha'],
  'restaurant',
  '[{"icon":"💇‍♀️","name":"Corte e Penteados","description":"Tendências em cortes femininos e masculinos com finalização profissional."},{"icon":"💅","name":"Manicure e Pedicure","description":"Unhas impecáveis com esmaltes de alta durabilidade e higiene."},{"icon":"✨","name":"Tratamentos Capilares","description":"Hidratação, botox capilar e reconstrução para cabelos saudáveis."}]',
  'Sua beleza realçada por profissionais apaixonados',
  'Agendar Horário', 'Marque pelo WhatsApp', 'Beleza que transforma',
  'salão de beleza moderno e iluminado',
  ARRAY['corte de cabelo sendo finalizado','unhas decoradas com design','produtos profissionais de beleza']
),

('construcao', 'Construção e Reforma',
  ARRAY['construção','construcao','reforma','pedreiro','arquiteto','engenheiro','engenharia','arquitetura','design de interiores','decoração','decoracao','obra','projeto','elétrica','eletrica','encanamento','pintor','marcenaria','marceneiro'],
  'portfolio',
  '[{"icon":"🏗️","name":"Projetos e Plantas","description":"Projetos arquitetônicos completos com aprovação na prefeitura."},{"icon":"🔨","name":"Reformas Residenciais","description":"Reforma com qualidade, prazo e orçamento transparente."},{"icon":"📐","name":"Design de Interiores","description":"Ambientes planejados que combinam estética e funcionalidade."}]',
  'Transformamos seus sonhos em projetos reais',
  'Solicitar Orçamento', 'Orçamento sem compromisso', 'Construindo seus sonhos',
  'obra ou construção moderna com equipamentos',
  ARRAY['projeto arquitetônico em planta','ambiente reformado e decorado','equipe trabalhando em obra']
),

('educacao', 'Educação e Cursos',
  ARRAY['escola','curso','educação','educacao','aula','professor','treinamento','ensino','idiomas','reforço','reforco','academia','matemática','matematica','português','portugues','pré-vestibular','pre-vestibular','concursos','ead','online'],
  'portfolio',
  '[{"icon":"📚","name":"Cursos e Aulas","description":"Metodologia moderna com professores qualificados e material didático exclusivo."},{"icon":"🎯","name":"Acompanhamento Individual","description":"Aulas personalizadas focadas nas necessidades de cada aluno."},{"icon":"🏆","name":"Preparatório para Concursos","description":"Preparação completa com simulados e material atualizado."}]',
  'Educação que transforma o futuro',
  'Matricule-se Já', 'Vagas limitadas para turmas novas', 'Conhecimento que abre portas',
  'sala de aula moderna com alunos',
  ARRAY['professor explicando matéria no quadro','alunos estudando em grupo','biblioteca ou espaço de estudo']
),

('generico', 'Genérico',
  ARRAY[],
  'portfolio',
  '[{"icon":"⭐","name":"Serviço Principal","description":"Conheça nossos serviços profissionais de alta qualidade."},{"icon":"📞","name":"Atendimento Personalizado","description":"Suporte direto e personalizado para cada cliente."},{"icon":"💡","name":"Soluções Sob Medida","description":"Soluções adaptadas às necessidades específicas do seu negócio."}]',
  'Soluções profissionais para o seu negócio',
  'Fale Conosco', 'Solicite um orçamento agora mesmo', 'Excelência em serviços',
  'escritório profissional moderno e iluminado',
  ARRAY['equipe trabalhando em escritório moderno','reunião de negócios em sala corporativa','detalhes de ambiente profissional']
);

-- 4. RPC function: match_contexts via cosine similarity
CREATE OR REPLACE FUNCTION match_contexts(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 1
)
RETURNS TABLE(
  id text,
  label text,
  template text,
  keywords text[],
  fallback_services jsonb,
  fallback_headline text,
  fallback_cta text,
  fallback_cta_sub text,
  fallback_tagline text,
  image_prompt text,
  gallery_prompts text[],
  tone_guidelines jsonb,
  few_shot_examples jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sc.id,
    sc.label,
    sc.template,
    sc.keywords,
    sc.fallback_services,
    sc.fallback_headline,
    sc.fallback_cta,
    sc.fallback_cta_sub,
    sc.fallback_tagline,
    sc.image_prompt,
    sc.gallery_prompts,
    sc.tone_guidelines,
    sc.few_shot_examples,
    1 - (sc.embedding <=> query_embedding) as similarity
  FROM site_contexts sc
  WHERE sc.embedding IS NOT NULL
    AND 1 - (sc.embedding <=> query_embedding) > match_threshold
  ORDER BY sc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. Index for efficient vector search
CREATE INDEX IF NOT EXISTS idx_site_contexts_embedding
  ON site_contexts
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 6. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_site_contexts_updated_at
  BEFORE UPDATE ON site_contexts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Tabela de feedback: registra gerações bem-sucedidas
CREATE TABLE IF NOT EXISTS generation_feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id     TEXT REFERENCES site_contexts(id),
  briefing_id     UUID,
  services        JSONB NOT NULL,
  headline        TEXT,
  cta             TEXT,
  accepted        BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generation_feedback_industry
  ON generation_feedback (industry_id, accepted);
