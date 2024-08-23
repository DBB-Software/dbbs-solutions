import * as Sentry from '@sentry/react-native'

const initOptions: Sentry.ReactNativeOptions = {
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN
}

export const initSentry = () => {
  Sentry.init(initOptions)
  // You can specify other initial sentry options here
}
