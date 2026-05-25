import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase não configurado');
  return createClient(url, key);
}

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === process.env.ADMIN_SESSION_TOKEN;
}

export async function GET() {
  try {
    const db = supabase();
    const { data, error } = await db.from('platform_settings').select('key, value');
    if (error) return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
    const settings: Record<string, string> = {};
    for (const row of data ?? []) settings[row.key] = row.value;
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const ALLOWED_KEYS = ['site_price', 'commission_default'];
  const updates: { key: string; value: string }[] = [];

  for (const key of ALLOWED_KEYS) {
    if (key in body) {
      const val = String(body[key]).trim();
      if (!val) continue;
      if ((key === 'site_price' || key === 'commission_default') && !/^\d+$/.test(val)) {
        return NextResponse.json({ error: `Valor inválido para ${key}` }, { status: 400 });
      }
      updates.push({ key, value: val });
    }
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'Nenhum campo válido enviado' }, { status: 400 });
  }

  try {
    const db = supabase();
    for (const { key, value } of updates) {
      const { error } = await db
        .from('platform_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (error) return NextResponse.json({ error: `Erro ao salvar ${key}` }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
  }
}
