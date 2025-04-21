import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/*
* TODO: Implementar a verificação de validade do token JWT
* TODO: Remover cookie com accessToken inválido
*/

export async function middleware(request: NextRequest) {
  const loginURL = new URL('/auth/login', request.url);

  const tokenCookie = request.cookies.get('auth-token');

  if (!tokenCookie?.value) {
    return NextResponse.redirect(loginURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
    '/dashboard/:path*',
    '/profile',
  ],
};