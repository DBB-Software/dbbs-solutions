import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app'

export const customInitializeApp = (options: FirebaseOptions, name?: string) => {
  if (getApps()?.length) {
    return getApp(name)
  }

  return initializeApp(options, name)
}

export * from 'firebase/app'
export * from 'firebase/analytics'
export * from 'firebase/auth'

export { customInitializeApp as initializeApp }
