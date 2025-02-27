import notifee from '@notifee/react-native'
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { remoteMessageListener } from '../../src/helpers/notifee-listener'

jest.mock('@notifee/react-native', () => ({
  displayNotification: jest.fn(),
  createChannel: jest.fn().mockResolvedValue('default')
}))

describe('remoteMessageListener', () => {
  it('should display a notification with the given title and body', async () => {
    const remoteMessage: FirebaseMessagingTypes.RemoteMessage = {
      notification: {
        title: 'Test Title',
        body: 'Test Body'
      },
      data: {
        metadata: JSON.stringify({ screen: 'Home' })
      },
      fcmOptions: {
        analyticsLabel: 'test_label'
      }
      // ...other properties...
    }

    await remoteMessageListener(remoteMessage)

    expect(notifee.displayNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Title',
        body: 'Test Body',
        data: JSON.stringify({ screen: 'Home' }),
        ios: { pressAction: { id: 'default' } }
      })
    )
  })
})
