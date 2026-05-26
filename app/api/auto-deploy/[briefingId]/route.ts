import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSiteHTML, type SiteBriefing } from '@/lib/site-generator';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Auto-deploy a paid briefing's static site to Vercel.
 *
 * POST /api/auto-deploy/[briefingId]
 * Protected by CRON_SECRET or admin session.
 *
 * Flow:
 * 1. Verify payment is approved
 * 2. Generate static HTML from briefing
 * 3. Deploy to Vercel via Deployments API (single file)
 * 4. Update briefing with deployed_at + deployed_url
 *
 * Requires env vars:
 * - VERCEL_DEPLOY_TOKEN: Vercel API token with deploy scope
 * - VERCEL_TEAM_ID: optional team/org ID
 */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ briefingId: string }> }
) {
  const { briefingId } = await params;

  // Auth: either CRON_SECRET or admin session
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const isAuthed = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isAuthed) {
    // Fallback: check admin cookie
    const cookieHeader = req.headers.get('cookie') ?? '';
    const adminToken = process.env.ADMIN_SESSION_TOKEN;
    const hasAdmin = adminToken && cookieHeader.includes(`admin_session=${adminToken}`);
    if (!hasAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!UUID_RE.test(briefingId)) {
    return NextResponse.json({ error: 'ID invalido' }, { status: 400 });
  }

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const vercelToken = process.env.VERCEL_DEPLOY_TOKEN;

  if (!supaUrl || !supaKey) {
    return NextResponse.json({ error: 'Supabase nao configurado.' }, { status: 500 });
  }
  if (!vercelToken) {
    return NextResponse.json({ error: 'VERCEL_DEPLOY_TOKEN nao configurado.' }, { status: 500 });
  }

  const supabase = createClient(supaUrl, supaKey);

  // Fetch briefing
  const { data: briefing, error: fetchErr } = await supabase
    .from('briefings')
    .select('id, segment, goal, palette, template, selected_modules, domain, domain_choice, whatsapp_number, business_hours, catalog_products, content_notes, logo_name, payment_status, deployed_at, created_at')
    .eq('id', briefingId)
    .single();

  if (fetchErr || !briefing) {
    return NextResponse.json({ error: 'Briefing nao encontrado.' }, { status: 404 });
  }

  if (briefing.payment_status !== 'approved') {
    return NextResponse.json({ error: 'Pagamento nao aprovado.' }, { status: 402 });
  }

  if (briefing.deployed_at) {
    return NextResponse.json({ error: 'Ja publicado.', deployed_at: briefing.deployed_at }, { status: 409 });
  }

  // Generate HTML
  const html = generateSiteHTML(briefing as SiteBriefing);

  // Determine project name from domain or briefing id
  let businessName = '';
  try {
    const notes = JSON.parse(briefing.content_notes ?? '{}');
    if (notes.businessName) businessName = notes.businessName;
  } catch {}

  const projectName = briefing.domain
    ? `sp-${briefing.domain.replace(/[^a-z0-9-]/gi, '-').slice(0, 40)}`
    : `sp-${briefingId.slice(0, 8)}`;

  try {
    // Deploy to Vercel using the v13 Deployments API
    const teamId = process.env.VERCEL_TEAM_ID;
    const deployUrl = teamId
      ? `https://api.vercel.com/v13/deployments?teamId=${teamId}`
      : 'https://api.vercel.com/v13/deployments';

    const deployRes = await fetch(deployUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectName,
        files: [
          {
            file: 'index.html',
            data: Buffer.from(html).toString('base64'),
            encoding: 'base64',
          },
        ],
        projectSettings: {
          framework: null, // static site
        },
        target: 'production',
      }),
    });

    if (!deployRes.ok) {
      const errBody = await deployRes.text();
      console.error('Vercel deploy failed:', deployRes.status, errBody);
      return NextResponse.json({ error: 'Falha ao publicar no Vercel.' }, { status: 502 });
    }

    const deployData = await deployRes.json();
    const deployedUrl = deployData.url
      ? `https://${deployData.url}`
      : deployData.alias?.[0]
        ? `https://${deployData.alias[0]}`
        : null;

    // Update briefing
    await supabase
      .from('briefings')
      .update({
        deployed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefingId);

    return NextResponse.json({
      success: true,
      deployedUrl,
      vercelUrl: deployData.url,
      projectName,
    });
  } catch (err) {
    console.error('Auto-deploy error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Erro ao publicar.' }, { status: 500 });
  }
}
