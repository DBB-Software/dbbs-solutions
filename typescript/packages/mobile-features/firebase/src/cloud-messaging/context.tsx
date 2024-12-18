import React, { createContext, FC, PropsWithChildren, useMemo } from 'react'
import messaging from '@react-native-firebase/messaging'
import { PushNotificationsContextType } from './types'

const fcm = messaging()

const defaultPushNotificationsContext: PushNotificationsContextType = {
  subscribe: () => {},
  unsubscribe: () => {},
  refreshToken: () => {}
}

export const PushNotificationsContext = createContext(defaultPushNotificationsContext)

export const PushNotificationsProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const value: PushNotificationsContextType = useMemo(
    () => ({
      async subscribe({ register, onError }) {
        if (!fcm.isDeviceRegisteredForRemoteMessages) {
          await fcm.registerDeviceForRemoteMessages()
        }

        try {
          const token = await fcm.getToken()

          register(token)
        } catch (error) {
          onError(error)
        }
      },

      async unsubscribe({ unregister, onError }) {
        try {
          if (fcm.isDeviceRegisteredForRemoteMessages) {
            await fcm.unregisterDeviceForRemoteMessages()
          }
          const token = await fcm.getToken()

          unregister(token)
        } catch (error) {
          onError(error)
        }
      },

      refreshToken(callback) {
        fcm.onTokenRefresh((token) => {
          callback?.(token)
        })
      }
    }),
    []
  )

  return <PushNotificationsContext.Provider value={value}>{children}</PushNotificationsContext.Provider>
}
