import type { NextAuthConfig } from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'

export default {
  providers: [Auth0],

  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user
      return isAuthenticated
    }
  }
} satisfies NextAuthConfig
