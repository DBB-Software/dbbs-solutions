import { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import { remoteMessageListener } from '../helpers/notifee-listener'

export const useRNCliDisplayNotification = () => {
  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(remoteMessageListener)

    return () => {
      unsubscribeOnMessage()
    }
  }, [])
}
