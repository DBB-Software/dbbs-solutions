import { getPermissionsAsync } from 'expo-notifications'

export const checkExpoPushNotificationPermission = async () => {
  const { granted } = await getPermissionsAsync()
  return granted
}
