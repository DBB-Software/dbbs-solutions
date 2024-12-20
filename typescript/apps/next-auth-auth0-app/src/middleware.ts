import NextAuth from 'next-auth'
import { PROTECTED_ROUTES } from './lib/routes'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req

  const isAuthenticated = !!req.auth
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => nextUrl.pathname.startsWith(route))

  if (!isAuthenticated && isProtectedRoute) return Response.redirect(new URL('/login', nextUrl))
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
