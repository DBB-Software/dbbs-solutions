import { getApp, getApps, initializeApp, type AppOptions } from 'firebase-admin/app'

export const customInitializeApp = (options: AppOptions, name?: string) => {
  if (getApps()?.length) {
    return getApp(name)
  }

  return initializeApp(options, name)
}

export * from 'firebase-admin/app'

export { customInitializeApp as initializeApp }
