import { betterFetch } from '@better-fetch/fetch'
import type { Session } from 'better-auth/types'
import { type NextRequest, NextResponse } from 'next/server'

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth', '/api/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verificar se o usuário está autenticado
  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    }
  )

  // Se não estiver autenticado e tentar acessar rota protegida, redirecionar para auth
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Se estiver autenticado e tentar acessar auth, redirecionar para dashboard
  if (session && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
