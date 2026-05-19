import { NextRequest, NextResponse } from 'next/server';
import { generateSiteHTML } from '@/lib/site-generator';
import type { SiteBriefing } from '@/lib/site-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, description, template, palette, selectedModules, whatsappNumber, businessHours, domain, catalogProducts, contentNotes } = body;

    const briefing: SiteBriefing = {
      id: 'preview',
      segment: body.segment ?? 'outro',
      goal: body.goal ?? 'whatsapp',
      palette: palette ?? 'corporate',
      template: template ?? 'portfolio',
      selected_modules: Array.isArray(selectedModules) ? selectedModules : [],
      domain: domain ?? null,
      domain_choice: body.domainChoice ?? 'later',
      whatsapp_number: whatsappNumber ?? null,
      business_hours: businessHours ?? null,
      catalog_products: Array.isArray(catalogProducts) ? catalogProducts : [],
      logo_name: body.logoName ?? null,
      content_notes: contentNotes ?? (description ? JSON.stringify({ businessName, description, ai: null }) : null),
      created_at: new Date().toISOString(),
    };

    const html = generateSiteHTML(briefing);

    // Inject PREVIEW watermark
    const watermark = `
<style>
#__preview-watermark {
  position: fixed; inset: 0; z-index: 99999;
  pointer-events: none; user-select: none;
  overflow: hidden; opacity: 0.07;
}
#__preview-watermark span {
  position: absolute;
  font-size: 52px;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: #000;
  white-space: nowrap;
  transform: rotate(-35deg);
}
</style>
<div id="__preview-watermark" aria-hidden="true">
  ${Array.from({ length: 25 }, (_, i) => `<span style="top:${(i % 5) * 22}%;left:${Math.floor(i / 5) * 35 - 15}%">PREVIEW</span>`).join('')}
</div>`;

    return new NextResponse(html.replace('</body>', `${watermark}</body>`), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err) {
    console.error('preview-quiz error:', err);
    return new NextResponse('Erro ao gerar preview', { status: 500 });
  }
}