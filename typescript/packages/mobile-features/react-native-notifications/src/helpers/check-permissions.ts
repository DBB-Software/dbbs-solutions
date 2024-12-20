import notifee, { AuthorizationStatus } from '@notifee/react-native'

export const checkRNCliPushNotificationPermission = async () => {
  const settings = await notifee.getNotificationSettings()
  return settings.authorizationStatus === AuthorizationStatus.AUTHORIZED
}
