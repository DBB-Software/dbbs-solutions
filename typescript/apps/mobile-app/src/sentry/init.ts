import * as Sentry from '@sentry/react-native'
import Config from 'react-native-config'

const initOptions: Sentry.ReactNativeOptions = {
  dsn: Config.MOBILE_APP_SENTRY_DSN
}

export const initSentry = () => {
  Sentry.init(initOptions)
  // You can specify other initial sentry options here
}
