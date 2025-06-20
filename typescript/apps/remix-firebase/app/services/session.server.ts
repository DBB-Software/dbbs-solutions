import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut as firebaseSignOut
} from '@dbbs/firebase/app-auth'
import { createCookieSessionStorage } from '@remix-run/node'
import { auth } from './firebase.server'

const storage = createCookieSessionStorage({
  cookie: {
    name: 'session',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: ['my-secret']
  }
})

export const getSessionToken = async (idToken: string) => {
  const { exp } = await auth.verifyIdToken(idToken)
  const tokenExpTime = exp * 1000
  const now = new Date().getTime()
  if (tokenExpTime <= now) {
    throw new Error('Session was expired')
  }

  return auth.createSessionCookie(idToken, { expiresIn: tokenExpTime - now })
}

export const createUserSession = async (idToken: string) => {
  const token = await getSessionToken(idToken)
  const session = await storage.getSession()
  session.set('token', token)

  return storage.commitSession(session)
}

export const getCookieToken = async (request: Request) => {
  const cookieSession = await storage.getSession(request.headers.get('Cookie'))
  return cookieSession.get('token')
}

export const getUserSession = async (request: Request) => {
  const token = await getCookieToken(request)
  if (!token) return null

  try {
    const tokenUser = await auth.verifySessionCookie(token, true)
    return tokenUser
  } catch (error) {
    return null
  }
}

export const signOut = async (request: Request) => {
  await firebaseSignOut(getAuth())
  const session = await storage.getSession(request.headers.get('Cookie'))
  return storage.destroySession(session)
}

export const signIn = async (email: string, password: string) => signInWithEmailAndPassword(getAuth(), email, password)

export const signUp = async (email: string, password: string, fullName: string) => {
  const { user } = await createUserWithEmailAndPassword(getAuth(), email, password)
  await sendEmailVerification(user)
  await updateProfile(user, { displayName: fullName })

  return user
}

export const updateUserName = async (userId: string, fullName: string) =>
  auth.updateUser(userId, { displayName: fullName })
