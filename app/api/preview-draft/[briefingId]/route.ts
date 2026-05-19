import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSiteHTML, type SiteBriefing } from '@/lib/site-generator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ briefingId: string }> }
) {
  const { briefingId } = await params;

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(briefingId)) {
    return new NextResponse('ID inválido', { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return new NextResponse('Supabase não configurado', { status: 500 });

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('briefings')
    .select('id, segment, goal, palette, template, selected_modules, domain, domain_choice, whatsapp_number, business_hours, catalog_products, content_notes, logo_name, created_at')
    .eq('id', briefingId)
    .single();

  if (error || !data) {
    return new NextResponse('Briefing não encontrado', { status: 404 });
  }

  const rawHtml = generateSiteHTML(data as SiteBriefing);

  // Inject PREVIEW watermark overlay into the <body>
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

  const html = rawHtml.replace('</body>', `${watermark}</body>`);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  });
}
