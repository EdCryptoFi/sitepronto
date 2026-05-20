/**
 * Script de validação do fluxo completo
 * Testa: detecção de indústria, geração de site, templates, fallbacks
 * Uso: npx tsx scripts/validate-flow.ts
 */

import { detectIndustry } from '../lib/industry';
import { generateSiteHTML } from '../lib/site-generator/index';
import type { SiteBriefing } from '../lib/site-generator/index';
import { scoreContent } from '../lib/content-score';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`  ❌ ${msg}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✅ ${msg}`);
  }
}

// ─── 1. Industry Detection ──────────────────────────────────────────────
console.log('\n📌 1. Detecção de segmento');

const cases = [
  ['Mecanica Valinhos', 'escapamento, suspensão, alinhamento, pneus', 'mecanica'],
  ['Dra. Maria Clínica', 'consultas, exames, pediatria', 'clinica'],
  ['Pizzaria cheiro verde', 'pizzas, massas, delivery', 'restaurante'],
  ['Loja da esquina', 'roupas, calçados, acessórios', 'loja'],
  ['João Advogados', 'trabalhista, previdenciário, cível', 'advocacia'],
  ['Studio Beleza', 'corte, manicure, depilação', 'beleza'],
  ['Construtora ABC', 'reforma, projetos, construção', 'construcao'],
  ['Curso Top', 'aulas, idiomas, reforço', 'educacao'],
  ['Unknown Generic', '', 'generico'],
];

for (const [name, desc, expected] of cases) {
  const result = detectIndustry(name, desc);
  const ok = result.id === expected;
  assert(ok, `${name} → ${result.id}${ok ? '' : ` (esperado: ${expected})`}`);
}

// ─── 2. Site Generation (all templates) ─────────────────────────────────
console.log('\n📌 2. Geração de HTML (4 templates)');

const baseBriefing: SiteBriefing = {
  id: 'test',
  segment: 'servicos',
  goal: 'whatsapp',
  palette: 'azul-editorial',
  template: 'portfolio',
  selected_modules: ['servicos', 'sobre', 'contato', 'galeria', 'depoimentos', 'faq'],
  domain: null,
  domain_choice: 'later',
  whatsapp_number: '5511999999999',
  business_hours: 'Seg-Sex: 9h-18h\nSáb: 9h-13h',
  catalog_products: [],
  content_notes: JSON.stringify({
    businessName: 'Mecanica Valinhos',
    description: 'escapamento, suspensão, alinhamento, pneus',
  }),
  logo_name: null,
  created_at: new Date().toISOString(),
};

for (const template of ['portfolio', 'restaurant', 'farmacy', 'store'] as const) {
  const briefing = { ...baseBriefing, template };
  try {
    const html = generateSiteHTML(briefing);
    const checks = [
      ['DOCTYPE', html.includes('<!DOCTYPE')],
      ['fecha </html>', html.includes('</html>')],
      ['viewport', html.includes('viewport')],
      ['container', html.includes('container')],
      ['WhatsApp', html.includes('wa-float') || html.includes('whatsapp')],
      ['palette color primary', html.includes('#004ac6')],
      ['business name', html.includes('Mecanica Valinhos')],
      ['font link', html.includes('fonts.googleapis.com')],
      ['animation CSS', html.includes('section-animate')],
      ['media queries', html.includes('@media')],
    ];
    const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
    assert(failed.length === 0, `Template "${template}": ${failed.length} falhas${failed.length ? ` (${failed.join(', ')})` : ''}`);
  } catch (e) {
    assert(false, `Template "${template}": erro ao gerar HTML - ${e}`);
  }
}

// ─── 3. Fallback quando description é vazia ─────────────────────────────
console.log('\n📌 3. Fallbacks com industria genérica');

const genericBriefing: SiteBriefing = {
  ...baseBriefing,
  content_notes: JSON.stringify({
    businessName: 'Meu Negócio',
    description: '',
  }),
};

const html = generateSiteHTML(genericBriefing);
assert(html.includes('Meu Negócio'), 'Usa nome genérico quando não tem nome específico');

// ─── 4. Style Variations ───────────────────────────────────────────────
console.log('\n📌 4. Variações de estilo (modern / classic / bold)');

for (const v of ['modern', 'classic', 'bold'] as const) {
  const h = generateSiteHTML(baseBriefing, v);
  assert(h.includes('</style><style>') || h.includes('</style>\n<style>'), `Variação "${v}" injeta CSS adicional`);
  assert(h.includes('--radius') || h.includes('font-scale'), `Variação "${v}" contém variáveis CSS`);
}

// ─── 5. Content Score ──────────────────────────────────────────────────
console.log('\n📌 5. Score de conteúdo');

const score = scoreContent('Mecanica Valinhos', 'escapamento, suspensão, alinhamento',
  [{ name: 'Reparo', description: 'Troca de escapamento' }],
  ['mecânica', 'escapamento']);
assert(typeof score.total === 'number' && score.total >= 0, `Score calculado: ${score.total}/100`);
assert(score.tips.length <= 5, 'Máximo 5 dicas');

// ─── Summary ────────────────────────────────────────────────────────────
console.log('\n' + (process.exitCode ? '❌ ALGUMAS VALIDAÇÕES FALHARAM' : '✅ TODAS AS VALIDAÇÕES PASSARAM'));
