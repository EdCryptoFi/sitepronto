import React from 'react';
import { Element } from '@craftjs/core';
import { HeroSection, TextBlock, ServicesSection, GallerySection, TestimonialsSection, FAQSection, StatsSection, ContactForm } from '@/lib/craftjs/components';
import { parseAICopyFromNotes } from '@/lib/ai-copy';
import type { SiteBriefing } from '@/lib/site-generator';

export function generateEditorJSX(briefing: SiteBriefing): React.ReactElement {
  const { ai } = parseAICopyFromNotes(briefing.content_notes);
  const mods = briefing.selected_modules ?? [];
  const name = briefing.domain
    ? briefing.domain.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Meu Negócio';

  const services = ai?.services ?? [];

  return React.createElement(
    Element,
    { is: 'div', canvas: true, className: 'min-h-screen' },
    React.createElement(HeroSection, {
      title: name,
      subtitle: ai?.hero_subheadline ?? 'Bem-vindo ao nosso site',
      cta: ai?.cta_main ?? 'Saiba mais',
    }),
    services.length > 0
      ? React.createElement(ServicesSection, { services, title: 'Nossos diferenciais' })
      : null,
    React.createElement(TextBlock, {
      content: ai?.footer_tagline
        ? `${ai.footer_tagline} — Site criado com SitePronto.`
        : 'Personalize esta página arrastando novos componentes do painel à esquerda.',
    }),
    mods.includes('galeria')
      ? React.createElement(GallerySection, { title: 'Galeria' })
      : null,
    mods.includes('depoimentos')
      ? React.createElement(TestimonialsSection, { title: 'Depoimentos' })
      : null,
    mods.includes('faq')
      ? React.createElement(FAQSection, { title: 'Perguntas frequentes' })
      : null,
    React.createElement(StatsSection, {
      stats: [
        { value: '100+', label: 'Clientes' },
        { value: '98%', label: 'Satisfação' },
        { value: '5★', label: 'Avaliação' },
      ],
    }),
    React.createElement(ContactForm, { title: 'Fale conosco' }),
  );
}
