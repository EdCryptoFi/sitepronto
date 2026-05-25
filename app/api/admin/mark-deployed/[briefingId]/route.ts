import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ briefingId: string }> }
) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (session?.value !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { briefingId } = await params;
  if (!UUID_RE.test(briefingId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

  const supabase = createClient(url, key);
  const { error } = await supabase
    .from('briefings')
    .update({ deployed_at: new Date().toISOString() })
    .eq('id', briefingId);

  if (error) return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });

  // Redirect back to briefings list
  return NextResponse.redirect(new URL('/admin/briefings', _req.url));
}
