import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { scheduleNotificationAsync } from 'expo-notifications'

export const handleExpoPushNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  // Schedule the notification with a null trigger to show immediately
  await scheduleNotificationAsync({
    content: remoteMessage,
    trigger: null
  })
}
