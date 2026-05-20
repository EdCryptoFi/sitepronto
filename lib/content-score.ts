export type ContentScore = {
  seo: number;
  readability: number;
  persuasion: number;
  total: number;
  tips: string[];
};

export function scoreContent(
  title: string,
  description: string,
  services: { name: string; description: string }[],
  seoKeywords: string[]
): ContentScore {
  const tips: string[] = [];
  const text = `${title} ${description} ${services.map(s => `${s.name} ${s.description}`).join(' ')}`.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  // ── SEO Score ──
  let seo = 50;
  if (title.length >= 30 && title.length <= 120) seo += 15;
  else tips.push(title.length < 30 ? 'Título muito curto para SEO' : 'Título muito longo para SEO');

  const hasKeywords = seoKeywords.filter(k => text.includes(k.toLowerCase())).length;
  seo += Math.min(hasKeywords * 5, 20);
  if (hasKeywords < 3) tips.push('Adicione mais palavras-chave no texto');

  if (description.includes('📍') || description.match(/[A-Z][a-z]+/) || description.length > 80) seo += 10;
  else tips.push('Descrição muito genérica');

  if (services.length >= 3) seo += 5;

  // ── Readability Score ──
  let readability = 50;
  const avgWordLen = text.replace(/\s+/g, '').length / wordCount || 1;
  if (avgWordLen > 4 && avgWordLen < 7) readability += 15;
  else tips.push(avgWordLen >= 7 ? 'Texto com palavras muito longas' : 'Texto muito simplificado');

  if (wordCount >= 80 && wordCount <= 300) readability += 15;
  else tips.push(wordCount < 80 ? 'Texto muito curto' : 'Texto muito longo');

  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const avgSentenceLen = wordCount / (sentences || 1);
  if (avgSentenceLen >= 8 && avgSentenceLen <= 20) readability += 10;
  else tips.push('Frases muito longas ou curtas demais');

  if (description.includes(',') || description.includes('—') || description.includes(';')) readability += 10;

  // ── Persuasion Score ──
  let persuasion = 50;
  const powerWords = ['grátis', 'exclusivo', 'garantido', 'rápido', 'fácil', 'melhor', 'novo', 'agora', 'resultado', 'segurança', 'confiança', 'qualidade', 'profissional', 'experiência', 'avaliação'];
  const foundPower = powerWords.filter(w => text.includes(w)).length;
  persuasion += Math.min(foundPower * 5, 20);
  if (foundPower < 2) tips.push('Adicione palavras de persuasão (grátis, exclusivo, garantido)');

  const hasCTA = description.includes('?') || description.includes('WhatsApp') || description.includes('agende') || description.includes('compre') || description.includes('peça');
  if (hasCTA) persuasion += 15;
  else tips.push('Adicione uma chamada para ação (CTA)');

  const hasNumbers = /\d+/.test(text);
  if (hasNumbers) persuasion += 10;
  else tips.push('Adicione números (anos, clientes, avaliações)');

  const hasSocial = text.includes('★') || text.includes('recomend') || text.includes('clientes') || text.includes('avaliação');
  if (hasSocial) persuasion += 5;

  return {
    seo: Math.min(seo, 100),
    readability: Math.min(readability, 100),
    persuasion: Math.min(persuasion, 100),
    total: Math.round((seo + readability + persuasion) / 3),
    tips: tips.slice(0, 5),
  };
}
