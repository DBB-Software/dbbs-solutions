import { scheduleNotificationAsync } from 'expo-notifications'
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { handleExpoPushNotification } from '../../src'

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn()
}))

describe('handleExpoPushNotification', () => {
  it('should schedule a notification with the given title and body', async () => {
    const remoteMessage: FirebaseMessagingTypes.RemoteMessage = {
      notification: {
        title: 'Test Title',
        body: 'Test Body'
      },
      fcmOptions: {}
      // ...other properties...
    }

    await handleExpoPushNotification(remoteMessage)

    expect(scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        notification: {
          title: 'Test Title',
          body: 'Test Body'
        },
        fcmOptions: {}
      },
      trigger: null
    })
  })
})
