import React from 'react'
import { AppNavigator } from '@navigators/app-navigator'
import { PaperProvider, useDefinedTheme } from '@dbbs/mobile-components'
import { detectAppLanguage } from '@dbbs/mobile-common'
import { PushNotificationsProvider, RemoteConfigProvider } from '@dbbs/mobile-firebase'
import { handleExpoPushNotification, useExpoDisplayNotification } from '@dbbs/mobile-expo-notifications'
import { setNotificationHandler } from 'expo-notifications'
import messaging from '@react-native-firebase/messaging'
import { initSentry } from '../sentry'
import { initialRemoteConfigValues } from './remote/remote-config-values'

import * as resources from './locale'
import '@dbbs/react-localization-provider'

initSentry()

detectAppLanguage(resources)

const fcm = messaging()
fcm.setBackgroundMessageHandler(handleExpoPushNotification)
setNotificationHandler({
  // Require for expo-notifications
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export const App = () => {
  const paperTheme = useDefinedTheme()
  useExpoDisplayNotification()
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
