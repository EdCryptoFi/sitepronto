import { NextRequest, NextResponse } from 'next/server';
import { analyzeLogoColors } from '@/lib/logo-analyzer';

// Rate limiting simples por IP (em memória — reinicia com o processo)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 8000; // 1 req por 8s por IP

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const now = Date.now();
  const last = rateLimitMap.get(ip) ?? 0;

  if (now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 });
  }
  rateLimitMap.set(ip, now);

  let body: { image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { image } = body;
  if (!image || typeof image !== 'string') {
    return NextResponse.json({ error: 'missing_image' }, { status: 400 });
  }

  // Limite de tamanho: ~2MB em base64
  if (image.length > 2_800_000) {
    return NextResponse.json({ error: 'image_too_large' }, { status: 400 });
  }

  const result = await analyzeLogoColors(image);

  if (!result) {
    return NextResponse.json({ error: 'analysis_failed' }, { status: 500 });
  }

  return NextResponse.json(result);
}
