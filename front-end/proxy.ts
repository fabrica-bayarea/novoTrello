import { NextRequest, NextResponse } from 'next/server'

const isDev = process.env.NODE_ENV === 'development'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // TODO: Ao implementar TLS, colocar "upgrade-insecure-requests;"
  //
  // Em dev (Turbopack/HMR), o Next injeta scripts inline sem nonce e
  // abre WebSocket pra hot reload. CSP estrito com nonce bloqueia esses
  // scripts e quebra interações (submit do form de login, por exemplo).
  // Por isso afrouxamos script-src e connect-src só em dev.
  // Em prod usávamos nonce + strict-dynamic, MAS o Next 16 não estava
  // carimbando o nonce nas tags <script> que ele injeta: o HTML saía com 23
  // scripts sem nonce e o navegador bloqueava TODOS — a página nunca
  // hidratava (nada clicável, tema não aplicava, login não funcionava).
  // Trocamos por 'self' + 'unsafe-inline': continua restrito ao próprio
  // domínio (nada de script de terceiros), mas permite os inline do Next.
  // TODO: voltar para nonce quando a propagação no Next 16 for resolvida.
  const cspHeader = isDev
    ? `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
      img-src 'self' data: blob:;
      font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
      connect-src 'self' ws: wss: http://localhost:3000 http://back:3000;
      frame-ancestors 'self';
      form-action 'self';
      base-uri 'self';
      object-src 'none';
    `
    : `
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
      img-src 'self' data:;
      font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
      connect-src 'self';
      frame-ancestors 'self';
      form-action 'self';
      base-uri 'self';
      object-src 'none';
    `;
  const sanitizedCspHeader = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  // O Next lê a CSP do header da REQUEST para descobrir o nonce e carimbá-lo
  // nas tags <script> que ele injeta. Sem esta linha, o HTML sai com os
  // scripts SEM nonce e a CSP ('nonce-...' + 'strict-dynamic') bloqueia todos
  // eles: a página nunca hidrata — nada fica clicável e o tema não aplica.
  requestHeaders.set('Content-Security-Policy', sanitizedCspHeader);

  // nextUrl.clone() preserva o basePath (/sprint em prod). Setar .pathname
  // e redirecionar mantém o prefixo — diferente de new URL(path, request.url),
  // que gera caminho absoluto SEM basePath e quebra no deploy em sub-path.
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/auth');
  if (isProtectedRoute) {
    const tokenCookie = request.cookies.get('sprinttacker-session');
    if (!tokenCookie?.value) {
      const loginURL = request.nextUrl.clone();
      loginURL.pathname = '/auth/login';
      const redirectResponse = NextResponse.redirect(loginURL);
      redirectResponse.headers.set('Content-Security-Policy', sanitizedCspHeader);
      return redirectResponse;
    }
  }

  const homeToDashboard = request.nextUrl.pathname === '/';
  if (homeToDashboard) {
    const dashboardURL = request.nextUrl.clone();
    dashboardURL.pathname = '/dashboard';
    const redirectResponse = NextResponse.redirect(dashboardURL);
    redirectResponse.headers.set('Content-Security-Policy', sanitizedCspHeader);
    return redirectResponse;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    'Content-Security-Policy',
    sanitizedCspHeader
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public|images).*)',
    '/dashboard/:path*',
    '/profile',
  ],
};