import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';
import { generateSiteHTML, generateReadme, type SiteBriefing } from '@/lib/site-generator';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ briefingId: string }> }
) {
  const { allowed } = checkRateLimit(`download:${getIp(req)}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde.' }, { status: 429 });
  }

  const { briefingId } = await params;

  if (!UUID_RE.test(briefingId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Serviço indisponível.' }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('briefings')
    .select('id, segment, goal, palette, template, selected_modules, domain, domain_choice, whatsapp_number, business_hours, catalog_products, content_notes, logo_name, payment_status, created_at')
    .eq('id', briefingId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 });
  }

  if (data.payment_status !== 'approved') {
    return NextResponse.json({ error: 'Pagamento ainda não confirmado.' }, { status: 402 });
  }

  const briefing = data as SiteBriefing & { payment_status: string };
  const html = generateSiteHTML(briefing);
  const readme = generateReadme(briefing);

  const zip = new JSZip();
  const folderName = briefing.domain
    ? briefing.domain.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
    : `site-${briefingId.slice(0, 8)}`;

  const folder = zip.folder(folderName)!;
  folder.file('index.html', html);
  folder.file('COMO-PUBLICAR.txt', readme);

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  return new NextResponse(zipBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${folderName}.zip"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
