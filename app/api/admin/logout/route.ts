import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const res = NextResponse.redirect(new URL('/admin/login', origin));
  res.cookies.set('admin_session', '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });
  return res;
}
