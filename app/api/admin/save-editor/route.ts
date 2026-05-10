import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const expected = process.env.ADMIN_SESSION_TOKEN;
  if (!expected || !session || session.value !== expected) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { briefingId, editorContent } = await req.json();

  if (!briefingId || !editorContent) {
    return NextResponse.json({ error: 'briefingId e editorContent são obrigatórios' }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ ok: true, simulated: true });
  }

  const { error } = await supabase
    .from('briefings')
    .update({ editor_content: editorContent, updated_at: new Date().toISOString() })
    .eq('id', briefingId);

  if (error) {
    console.error('[save-editor] erro Supabase');
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
