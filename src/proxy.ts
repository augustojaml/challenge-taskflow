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
  console.log(pathname)

  if (pathname === '/api/health') {
    return NextResponse.next()
  }

  if (process.env.NODE_ENV === 'test') {
    return NextResponse.next()
  }

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    staticFileExtensions.some((ext) => pathname.endsWith(ext))
  ) {
    return NextResponse.next()
  }

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route),
  )
  const isApiRoute = pathname.startsWith('/api')

  if ((isPublicRoute && !isAuthRoute) || isPublicApiRoute) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token && isApiRoute && !isPublicApiRoute) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isApiRoute) {
    if (token) {
      try {
        const payload = tokenJWT.verifyToken(token) as JWTPayload

        if (isAuthRoute) {
          const url = request.nextUrl.clone()
          url.pathname = '/'
          return NextResponse.redirect(url)
        }

        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', payload.userId)
        requestHeaders.set('x-user-email', payload.email)

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      } catch {
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  if (token) {
    try {
      const payload = tokenJWT.verifyToken(token) as JWTPayload

      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId)
      requestHeaders.set('x-user-email', payload.email)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}
