import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { generateSiteHTML, type SiteBriefing } from '@/lib/site-generator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ briefingId: string }> }
) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_SESSION_TOKEN) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

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

  if (error || !data) return new NextResponse('Briefing não encontrado', { status: 404 });

  const html = generateSiteHTML(data as SiteBriefing);
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
