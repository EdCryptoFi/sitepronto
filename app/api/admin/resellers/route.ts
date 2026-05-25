import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

function generateCode(name: string): string {
  const slug = name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${slug}-${rand}`;
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const { name, email, whatsapp } = body;
  if (
    typeof name !== 'string' || name.trim().length < 2 ||
    typeof email !== 'string' || !email.includes('@')
  ) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

  const supabase = createClient(url, key);
  const code = generateCode(name.trim());

  const { data, error } = await supabase
    .from('resellers')
    .insert({
      name: name.trim(),
      email: (email as string).trim().toLowerCase(),
      whatsapp: typeof whatsapp === 'string' ? whatsapp.trim() : null,
      code,
    })
    .select('id, code')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Erro ao criar revendedor' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, code: data.code });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const { id, is_active } = body;
  if (typeof id !== 'string' || typeof is_active !== 'boolean') {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

  const supabase = createClient(url, key);
  const { error } = await supabase
    .from('resellers')
    .update({ is_active })
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
