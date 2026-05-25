import { NextRequest, NextResponse } from 'next/server';
import { generateWATemplates } from '@/lib/whatsapp-templates';

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 10000;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const now = Date.now();
  if (now - (rateLimitMap.get(ip) ?? 0) < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 });
  }
  rateLimitMap.set(ip, now);

  let body: { businessName?: string; segment?: string; objective?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const templates = await generateWATemplates({
    businessName: body.businessName ?? '',
    segment:      body.segment      ?? '',
    objective:    body.objective    ?? '',
  });

  if (!templates) return NextResponse.json({ error: 'generation_failed' }, { status: 500 });
  return NextResponse.json(templates);
}
