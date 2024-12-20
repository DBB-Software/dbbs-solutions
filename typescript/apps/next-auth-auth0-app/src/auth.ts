import NextAuth from 'next-auth'
import authConfig from './auth.config'

export { signIn, signOut } from 'next-auth/react'

export const { handlers, auth } = NextAuth({
  ...authConfig
})
