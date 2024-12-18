import React from 'react'
import { AppNavigator } from '@navigators/app-navigator'
import { PaperProvider, useDefinedTheme } from '@dbbs/mobile-components'
import { detectAppLanguage } from '@dbbs/mobile-common'
import { PushNotificationsProvider, RemoteConfigProvider } from '@dbbs/mobile-firebase'
import { useRNCliDisplayNotification } from '@dbbs/mobile-react-native-notifications'
import messaging from '@react-native-firebase/messaging'
import notifee from '@notifee/react-native'
import { initSentry } from '../sentry'
import { initialRemoteConfigValues } from './remote/remote-config-values'

import * as resources from './locale'
import '@dbbs/react-localization-provider'

initSentry()

detectAppLanguage(resources)

const fcm = messaging()
fcm.setBackgroundMessageHandler(notifee.displayNotification)

export const App = () => {
  const paperTheme = useDefinedTheme()
  useRNCliDisplayNotification()
  return (
    <PushNotificationsProvider>
      <PaperProvider theme={paperTheme}>
        <RemoteConfigProvider initialValues={initialRemoteConfigValues}>
          <AppNavigator />
        </RemoteConfigProvider>
      </PaperProvider>
    </PushNotificationsProvider>
  )
}
