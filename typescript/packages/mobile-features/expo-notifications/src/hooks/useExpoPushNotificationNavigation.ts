import { useEffect } from 'react'
import {
  getLastNotificationResponseAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener
} from 'expo-notifications'
import { parseJSONWithFallback } from '@dbbs/mobile-common'

export interface NotificationMetadata extends Record<string, string | number | object | undefined> {
  screen?: string
}

interface ExpoPushNotificationNavigationProps {
  navigateToContent: (metadata?: NotificationMetadata) => void
}

export const useExpoPushNotificationNavigation = ({ navigateToContent }: ExpoPushNotificationNavigationProps) => {
  useEffect(() => {
    const checkInitialNotification = async () => {
      const response = await getLastNotificationResponseAsync()
      if (response && response.notification.request.content.data) {
        const data = parseJSONWithFallback<NotificationMetadata>(
          JSON.stringify(response.notification.request.content.data.metadata)
        )
        if (data) navigateToContent(data)
      }
    }
    checkInitialNotification()
  }, [navigateToContent])

  useEffect(() => {
    const foregroundSubscription = addNotificationReceivedListener((notification) => {
      const data = parseJSONWithFallback<NotificationMetadata>(
        JSON.stringify(notification.request.content.data.metadata)
      )
      if (data) navigateToContent(data)
    })

    const foregroundPressSubscription = addNotificationResponseReceivedListener((response) => {
      const data = parseJSONWithFallback<NotificationMetadata>(
        JSON.stringify(response.notification.request.content.data.metadata)
      )
      if (data) navigateToContent(data)
    })

    return () => {
      foregroundSubscription.remove()
      foregroundPressSubscription.remove()
    }
  }, [navigateToContent])
}
