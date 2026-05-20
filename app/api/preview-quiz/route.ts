import { NextRequest, NextResponse } from 'next/server';
import { generateSiteHTML, STYLE_VARIATIONS } from '@/lib/site-generator';
import type { SiteBriefing, StyleVariationId } from '@/lib/site-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { variation, ...rest } = body;

    const buildBriefing = (): SiteBriefing => ({
      id: 'preview',
      segment: body.segment ?? 'outro',
      goal: body.goal ?? 'whatsapp',
      palette: body.palette ?? 'corporate',
      template: body.template ?? 'portfolio',
      selected_modules: Array.isArray(body.selectedModules) ? body.selectedModules : [],
      domain: body.domain ?? null,
      domain_choice: body.domainChoice ?? 'later',
      whatsapp_number: body.whatsappNumber ?? null,
      business_hours: body.businessHours ?? null,
      catalog_products: Array.isArray(body.catalogProducts) ? body.catalogProducts : [],
      logo_name: body.logoName ?? null,
      content_notes: body.contentNotes ?? (body.description ? JSON.stringify({ businessName: body.businessName, description: body.description, ai: null }) : null),
      created_at: new Date().toISOString(),
    });

    const wrapWatermark = (html: string) => {
      const wm = `
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
      return html.replace('</body>', `${wm}</body>`);
    };

    // If requesting a specific variation, return single HTML
    if (variation && STYLE_VARIATIONS.some(v => v.id === variation)) {
      const html = generateSiteHTML(buildBriefing(), variation as StyleVariationId);
      return new NextResponse(wrapWatermark(html), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Otherwise return all 3 variations as JSON for carousel
    const results = await Promise.all(
      STYLE_VARIATIONS.map(async (v) => {
        const html = generateSiteHTML(buildBriefing(), v.id);
        return { id: v.id, name: v.name, label: v.label, html: wrapWatermark(html) };
      })
    );

    return NextResponse.json({ variations: results });
  } catch (err) {
    console.error('preview-quiz error:', err);
    return new NextResponse('Erro ao gerar preview', { status: 500 });
  }
}
