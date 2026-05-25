import { NextRequest, NextResponse } from 'next/server';
import { generateHeadlineVariants } from '@/lib/ai-copy';

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 5000;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const now = Date.now();
  if (now - (rateLimitMap.get(ip) ?? 0) < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 });
  }
  rateLimitMap.set(ip, now);

  let body: { businessName?: string; objective?: string; description?: string; industry?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const variants = await generateHeadlineVariants({
    businessName: body.businessName ?? '',
    objective:    body.objective    ?? '',
    description:  body.description  ?? '',
    industry:     body.industry     ?? '',
  });

  if (!variants) return NextResponse.json({ error: 'generation_failed' }, { status: 500 });
  return NextResponse.json(variants);
}
