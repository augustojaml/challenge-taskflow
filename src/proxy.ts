import { NextRequest, NextResponse } from 'next/server'

import { type JWTPayload, tokenJWT } from '@/shared/helpers'

const publicRoutes = ['/auth/login', '/auth/register', '/docs']
const authRoutes = ['/auth/login', '/auth/register']
const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/swagger',
]

const staticFileExtensions = [
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.css',
  '.js',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir que arquivos estáticos passem sem processamento
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    staticFileExtensions.some((ext) => pathname.endsWith(ext))
  ) {
    return NextResponse.next()
  }

  // Verificar se é uma rota pública (docs, etc)
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route),
  )
  const isApiRoute = pathname.startsWith('/api')

  // Se for rota pública (docs, etc) ou rota de API pública, permitir acesso
  if ((isPublicRoute && !isAuthRoute) || isPublicApiRoute) {
    return NextResponse.next()
  }

  // Obter token do cookie ou header
  const token =
    request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  // Se for rota de API protegida e não tiver token, retornar 401
  if (!token && isApiRoute && !isPublicApiRoute) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Se não houver token e não for rota de auth, redirecionar para login
  if (!token && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Se houver token, verificar se é válido
  if (token) {
    try {
      const payload = tokenJWT.verifyToken(token) as JWTPayload

      // Se estiver em rota de auth e autenticado, redirecionar para dashboard
      if (isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }

      // Adicionar headers com informações do usuário para uso nas rotas
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId)
      requestHeaders.set('x-user-email', payload.email)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch {
      // Token inválido, limpar cookie e redirecionar para login
      if (!isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        const response = NextResponse.redirect(url)
        response.cookies.delete('auth_token')
        return response
      }
    }
  }

  // Se não for rota de auth e não tiver token válido, redirecionar para login
  if (!isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
}
