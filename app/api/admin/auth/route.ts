import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // 5 tentativas por IP a cada 15 minutos
  const { allowed, retryAfterMs } = checkRateLimit(`admin-auth:${getIp(req)}`, 5, 15 * 60_000);
  if (!allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
    });
  }

  let password: unknown;
  try {
    const body = await req.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 });
  }

  if (typeof password !== 'string' || password.length > 200) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  const token = process.env.ADMIN_SESSION_TOKEN ?? '';
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return res;
}
