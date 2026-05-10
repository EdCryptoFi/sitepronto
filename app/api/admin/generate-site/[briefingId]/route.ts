import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';
import { generateSiteHTML, generateReadme, type SiteBriefing } from '@/lib/site-generator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ briefingId: string }> }
) {
  // Auth check (middleware handles page routes; API routes need manual check)
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { briefingId } = await params;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(briefingId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('briefings')
    .select('id, segment, goal, palette, template, selected_modules, domain, domain_choice, whatsapp_number, business_hours, catalog_products, content_notes, logo_name, created_at')
    .eq('id', briefingId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Briefing não encontrado' }, { status: 404 });
  }

  const briefing = data as SiteBriefing;
  const html = generateSiteHTML(briefing);
  const readme = generateReadme(briefing);

  const zip = new JSZip();
  const folderName = briefing.domain ? briefing.domain.replace(/[^a-z0-9-]/gi, '-') : `site-${briefingId.slice(0, 8)}`;
  const folder = zip.folder(folderName)!;
  folder.file('index.html', html);
  folder.file('README.txt', readme);

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  return new NextResponse(zipBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${folderName}.zip"`,
    },
  });
}
