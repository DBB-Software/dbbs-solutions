import { useEffect } from 'react'
import { Platform } from 'react-native'
import { captureException } from '@sentry/react-native'
import { initConnection, flushFailedPurchasesCachedAsPendingAndroid, endConnection } from 'react-native-iap'
import { logger } from 'react-native-logs'

const log = logger.createLogger()

const initializeIAPConnection = async () => {
  const result = await initConnection().catch((err) => {
    log.error(err)
    captureException(err)
  })
  if (result) {
    log.info('IAP connection initialized')
  }

  if (Platform.OS === 'android') {
    await flushFailedPurchasesCachedAsPendingAndroid().catch((err) => {
      log.error(err)
      captureException(err)
    })
  }
}
export const useInitializeIAPConnection = () => {
  useEffect(() => {
    initializeIAPConnection()

    return () => {
      endConnection()
    }
  }, [])
}
