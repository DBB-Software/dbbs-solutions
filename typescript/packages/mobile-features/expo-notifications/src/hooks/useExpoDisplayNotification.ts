import { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import { handleExpoPushNotification } from '../helpers/expo-listener'

export const useExpoDisplayNotification = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(handleExpoPushNotification)

    return () => {
      unsubscribe()
    }
  }, [])
}
