import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ briefingId: string }> }
) {
  const { briefingId } = await params;

  if (!briefingId || !UUID_RE.test(briefingId)) {
    return NextResponse.json({ error: 'briefingId inválido.' }, { status: 400 });
  }

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!supaUrl || !supaKey) {
    return NextResponse.json({ error: 'Supabase não configurado.' }, { status: 500 });
  }

  const supabase = createClient(supaUrl, supaKey);
  const { data: briefing } = await supabase
    .from('briefings')
    .select('id, payment_status, mp_payment_id')
    .eq('id', briefingId)
    .single();

  if (!briefing) {
    return NextResponse.json({ error: 'Briefing não encontrado.' }, { status: 404 });
  }

  // If already approved in our DB, return immediately
  if (briefing.payment_status === 'approved') {
    return NextResponse.json({ status: 'approved' });
  }

  // If we have an MP payment ID, check its status
  if (briefing.mp_payment_id && accessToken) {
    try {
      const mp = new MercadoPagoConfig({ accessToken });
      const paymentApi = new Payment(mp);
      const mpPayment = await paymentApi.get({ id: Number(briefing.mp_payment_id) });

      const mpStatus = mpPayment.status ?? 'pending';

      // Update our DB if status changed
      if (mpStatus === 'approved' && briefing.payment_status !== 'approved') {
        await supabase
          .from('briefings')
          .update({
            payment_status: 'approved',
            updated_at: new Date().toISOString(),
          })
          .eq('id', briefingId);

        // Fire-and-forget: trigger auto-deploy + confirmation email
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sitepronto.com';
        const cronSecret = process.env.CRON_SECRET;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (cronSecret) headers['Authorization'] = `Bearer ${cronSecret}`;

        // Auto-deploy
        fetch(`${baseUrl}/api/auto-deploy/${briefingId}`, {
          method: 'POST',
          headers,
        }).catch(() => {});

        // Confirmation email (needs briefing email)
        const { data: fullBriefing } = await supabase
          .from('briefings')
          .select('email')
          .eq('id', briefingId)
          .single();

        if (fullBriefing?.email) {
          fetch(`${baseUrl}/api/send-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ briefingId, email: fullBriefing.email }),
          }).catch(() => {});
        }

        return NextResponse.json({ status: 'approved' });
      }

      if (mpStatus === 'rejected' || mpStatus === 'cancelled') {
        return NextResponse.json({ status: 'rejected' });
      }

      return NextResponse.json({ status: 'pending' });
    } catch (error) {
      console.error('MP status check error:', error instanceof Error ? error.message : String(error));
      // Fallback to DB status
      return NextResponse.json({ status: briefing.payment_status ?? 'pending' });
    }
  }

  return NextResponse.json({ status: briefing.payment_status ?? 'pending' });
}
