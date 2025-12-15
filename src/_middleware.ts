import { NextRequest, NextResponse } from 'next/server'

import { type JWTPayload, tokenJWT } from '@/shared/helpers'

const publicRoutes = ['/auth/login', '/auth/register', '/docs', '/api']
const authRoutes = ['/auth/login', '/auth/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota pública (API, docs, etc)
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Se for rota pública (API ou docs), permitir acesso
  if (isPublicRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // Obter token do cookie ou header
  const token =
    request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

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
    } catch (error) {
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
