import { Platform } from 'react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import notifee, { type Notification } from '@notifee/react-native'
import { parseJSONWithFallback } from '@dbbs/mobile-common'
import Config from 'react-native-config'

const CHANNEL_ID = Config.NOTIFEE_CHANNEL_ID ?? 'CHANNEL_ID'
const CHANNEL_NAME = Config.NOTIFEE_CHANNEL_NAME ?? 'CHANNEL_NAME'

const onDisplayNotification = async (notification: Notification, metadata?: string | object) => {
  const channelId = await notifee.createChannel({
    id: CHANNEL_ID,
    name: CHANNEL_NAME
  })

  await notifee.displayNotification({
    ...notification,
    ...Platform.select({
      android: {
        android: {
          ...notification.android,
          channelId,
          pressAction: {
            id: 'default'
          }
        }
      },
      ios: {
        ios: {
          ...notification.ios,
          pressAction: {
            id: 'default'
          }
        }
      }
    }),
    data: parseJSONWithFallback<Notification['data']>(JSON.stringify(metadata))
  })
}

export const remoteMessageListener = (message: FirebaseMessagingTypes.RemoteMessage) => {
  if (message.notification) {
    onDisplayNotification(message.notification as Notification, message.data?.metadata)
  }
}
