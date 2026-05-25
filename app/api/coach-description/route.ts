import { NextRequest, NextResponse } from 'next/server';
import { analyzeDescription } from '@/lib/description-coach';

// Rate limit: 1 req por 6s por IP
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 6000;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const now = Date.now();
  if (now - (rateLimitMap.get(ip) ?? 0) < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 });
  }
  rateLimitMap.set(ip, now);

  let body: { text?: string; businessName?: string; objective?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { text = '', businessName = '', objective = '' } = body;
  if (typeof text !== 'string') {
    return NextResponse.json({ error: 'missing_text' }, { status: 400 });
  }

  const feedback = await analyzeDescription(text, businessName, objective);
  if (!feedback) {
    return NextResponse.json({ error: 'analysis_failed' }, { status: 500 });
  }

  return NextResponse.json(feedback);
}
