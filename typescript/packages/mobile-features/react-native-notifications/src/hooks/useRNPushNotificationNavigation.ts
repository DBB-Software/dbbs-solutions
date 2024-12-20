import { useEffect } from 'react'
import notifee, { EventType } from '@notifee/react-native'
import { parseJSONWithFallback } from '@dbbs/mobile-common'

export interface NotificationMetadata extends Record<string, string | number | object | undefined> {
  screen?: string
}

interface RNPushNotificationNavigationProps {
  navigateToContent: (metadata?: NotificationMetadata) => void
}

export const useRNPushNotificationNavigation = ({ navigateToContent }: RNPushNotificationNavigationProps) => {
  notifee.getInitialNotification().then((event) => {
    if (event) {
      const data = parseJSONWithFallback<NotificationMetadata>(JSON.stringify(event.notification.data?.metadata))
      if (data) navigateToContent(data)
    }
  })
  notifee.onBackgroundEvent(async (event) => {
    if (event.detail.notification && event.type === EventType.PRESS) {
      navigateToContent(event.detail.notification?.data)
    }
  })
  useEffect(() => {
    const unsubscribeForegroundEvent = notifee.onForegroundEvent((event) => {
      if (event.detail.notification && event.type === EventType.PRESS) {
        navigateToContent(event.detail.notification?.data)
      }
    })

    return () => {
      unsubscribeForegroundEvent()
    }
  }, [navigateToContent])
}
