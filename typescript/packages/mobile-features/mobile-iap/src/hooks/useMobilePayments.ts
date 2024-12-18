import { useEffect } from 'react'
import { captureException } from '@sentry/react-native'
import { useIAP } from 'react-native-iap'
import { logger } from 'react-native-logs'

export interface MobilePaymentProps {
  productSkus?: string[]
  subscriptionSkus?: string[]
}

const log = logger.createLogger()

export const useMobilePayments = ({ productSkus, subscriptionSkus }: MobilePaymentProps) => {
  const iapContext = useIAP()

  useEffect(() => {
    if (!iapContext.connected) return

    if (productSkus && iapContext.products.length === 0) {
      iapContext.getProducts({ skus: productSkus })
    }
    if (subscriptionSkus && iapContext.subscriptions.length === 0) {
      iapContext.getSubscriptions({ skus: subscriptionSkus })
    }
  }, [iapContext, productSkus, subscriptionSkus])

  useEffect(() => {
    if (iapContext.currentPurchaseError) {
      log.error(iapContext.currentPurchaseError)
      captureException(iapContext.currentPurchaseError)
    }
  }, [iapContext.currentPurchaseError])

  useEffect(() => {
    if (iapContext.currentPurchase) {
      log.info(iapContext.currentPurchase)
    }
  }, [iapContext.currentPurchase])

  return iapContext
}
