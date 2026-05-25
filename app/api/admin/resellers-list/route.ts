import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (session?.value !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json([], { status: 200 });

  const supabase = createClient(url, key);

  const { data: resellers } = await supabase
    .from('resellers')
    .select('id, name, email, whatsapp, code, commission_value, is_active, created_at')
    .order('created_at', { ascending: false });

  if (!resellers) return NextResponse.json([]);

  // Count approved sales per reseller
  const { data: briefings } = await supabase
    .from('briefings')
    .select('referral_code, payment_status')
    .not('referral_code', 'is', null);

  const salesByCode: Record<string, number> = {};
  for (const b of briefings ?? []) {
    if (b.payment_status === 'approved' && b.referral_code) {
      salesByCode[b.referral_code] = (salesByCode[b.referral_code] ?? 0) + 1;
    }
  }

  return NextResponse.json(
    resellers.map((r) => ({
      ...r,
      sales_count: salesByCode[r.code] ?? 0,
      total_commission: (salesByCode[r.code] ?? 0) * r.commission_value,
    }))
  );
}
