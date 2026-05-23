// ─── CONTEXT FEEDBACK API ─────────────────────────────────────────────────────
// Registra gerações bem-sucedidas ou rejeitadas para melhorar os few-shot
// examples do context engine.
//
// POST /api/context-feedback
// Body: { industryId, briefingId, services, headline, cta, accepted }

import { NextResponse } from 'next/server';
import { recordSuccessfulGeneration } from '@/lib/context-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { industryId, briefingId, services, headline, cta_main, cta_sub, tagline, accepted } = body;

    if (!industryId || !services) {
      return NextResponse.json({ error: 'industryId and services are required' }, { status: 400 });
    }

    await recordSuccessfulGeneration(industryId, briefingId, {
      services,
      headline,
      cta_main,
      cta_sub,
      tagline,
    }, accepted ?? true);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
