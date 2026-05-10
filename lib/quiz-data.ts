import { ShoppingBag, Wrench, Image, Building2 } from 'lucide-react';

export type TemplateId = 'restaurant' | 'farmacy' | 'store' | 'portfolio';
export type ObjectiveId = 'vender-produtos' | 'servicos' | 'portfolio' | 'institucional';

export const OBJECTIVE_TO_TEMPLATE: Record<ObjectiveId, TemplateId> = {
  'vender-produtos': 'store',
  'servicos':        'farmacy',
  'portfolio':       'portfolio',
  'institucional':   'restaurant',
};

export const OBJECTIVE_TO_SEGMENT: Record<ObjectiveId, string> = {
  'vender-produtos': 'loja',
  'servicos':        'servicos',
  'portfolio':       'educacao',
  'institucional':   'outro',
};

export const OBJECTIVE_TO_GOAL: Record<ObjectiveId, string> = {
  'vender-produtos': 'vender',
  'servicos':        'whatsapp',
  'portfolio':       'portfolio',
  'institucional':   'whatsapp',
};

export const objectives = [
  { id: 'vender-produtos' as ObjectiveId, name: 'Vender Produtos', helper: 'Loja, catálogo, e-commerce', icon: ShoppingBag },
  { id: 'servicos' as ObjectiveId, name: 'Prestação de Serviços', helper: 'Clínica, consultório, agendamento', icon: Wrench },
  { id: 'portfolio' as ObjectiveId, name: 'Portfólio Profissional', helper: 'Designer, fotógrafo, freelancer', icon: Image },
  { id: 'institucional' as ObjectiveId, name: 'Site Institucional', helper: 'Empresa, escritório, apresentação', icon: Building2 },
] as const;

export const palettes = [
  {
    id: 'minimal',
    name: 'Minimal',
    helper: 'Sóbrio e atemporal.',
    colors: ['#6b7280', '#9ca3af', '#f3f4f6'],
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    helper: 'Energia e destaque.',
    colors: ['#004ac6', '#eab308', '#ec4899'],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    helper: 'Confiança e seriedade.',
    colors: ['#002855', '#004ac6', '#dbe1ff'],
  },
  {
    id: 'nature',
    name: 'Nature',
    helper: 'Equilíbrio e calma.',
    colors: ['#059669', '#f97316', '#d1fae5'],
  },
  {
    id: 'tech',
    name: 'Tech',
    helper: 'Modernidade futurista.',
    colors: ['#111827', '#06b6d4', '#7c3aed'],
  },
  {
    id: 'elegant',
    name: 'Elegant',
    helper: 'Luxo e sofisticação.',
    colors: ['#2b1b17', '#b58e58', '#f5f1ed'],
  },
] as const;

export const quizModules = [
  { id: 'servicos', name: 'Serviços', helper: 'Apresentação detalhada dos seus serviços ou produtos.' },
  { id: 'sobre', name: 'Sobre a Empresa', helper: 'Sua história, missão e os valores.' },
  { id: 'contato', name: 'Contato', helper: 'Formulário, mapa e links sociais.' },
  { id: 'galeria', name: 'Galeria de Fotos', helper: 'Exibição visual de trabalhos.' },
  { id: 'depoimentos', name: 'Depoimentos', helper: 'Prova social com depoimentos.' },
  { id: 'faq', name: 'FAQ', helper: 'Perguntas frequentes.' },
] as const;

export const templates = [
  { id: 'restaurant' as TemplateId, name: 'Restaurant', helper: 'Gastronomia, eventos e hospitalidade.', suggested: ['vender-produtos', 'institucional'] },
  { id: 'farmacy' as TemplateId, name: 'Clínica & Saúde', helper: 'Clínicas, consultórios e saúde.', suggested: ['servicos'] },
  { id: 'store' as TemplateId, name: 'Loja & Comércio', helper: 'Venda direta e catálogo de produtos.', suggested: ['vender-produtos'] },
  { id: 'portfolio' as TemplateId, name: 'Portfólio', helper: 'Designers, artistas e fotógrafos.', suggested: ['portfolio'] },
] as const;
