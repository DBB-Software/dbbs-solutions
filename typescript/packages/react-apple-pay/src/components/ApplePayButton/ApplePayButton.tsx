import { FC, useEffect, useState } from 'react'
import { APPLE_PAY_BUTTON_TEST_ID } from './testIds'

const APPLE_PAY_SDK_URL = 'https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js'

export type ApplePayButtonProps = {
  paymentRequest: ApplePayJS.ApplePayPaymentRequest
  fetchMerchantSession: (validationURL: string) => Promise<unknown>
  onPaymentAuthorized: (payment: ApplePayJS.ApplePayPayment) => Promise<ApplePayJS.ApplePayPaymentAuthorizationResult>
  onPaymentCancelled?: () => void
  onPaymentMethodSelected?: (
    event: ApplePayJS.ApplePayPaymentMethodSelectedEvent
  ) => Promise<ApplePayJS.ApplePayPaymentMethodUpdate>
  onShippingMethodSelected?: (
    event: ApplePayJS.ApplePayShippingMethodSelectedEvent
  ) => Promise<ApplePayJS.ApplePayShippingMethodUpdate>
  onShippingContactSelected?: (
    event: ApplePayJS.ApplePayShippingContactSelectedEvent
  ) => Promise<ApplePayJS.ApplePayShippingContactUpdate>
  onCouponCodeChanged?: (
    event: ApplePayJS.ApplePayCouponCodeChangedEvent
  ) => Promise<ApplePayJS.ApplePayCouponCodeUpdate>
  apiVersion?: number
  buttonStyle?: 'black' | 'white' | 'white-outline'
  type?:
    | 'plain'
    | 'buy'
    | 'donate'
    | 'checkout'
    | 'book'
    | 'subscribe'
    | 'reload'
    | 'add-money'
    | 'top-up'
    | 'order'
    | 'rent'
    | 'support'
    | 'contribute'
    | 'tip'
}

const ApplePayButton: FC<ApplePayButtonProps> = ({
  paymentRequest,
  fetchMerchantSession,
  onPaymentAuthorized,
  onPaymentCancelled,
  onPaymentMethodSelected,
  onShippingMethodSelected,
  onShippingContactSelected,
  onCouponCodeChanged,
  apiVersion = 3,
  buttonStyle = 'black',
  type = 'buy'
}) => {
  const [applePayAvailable, setApplePayAvailable] = useState(false)

  useEffect(() => {
    const loadApplePaySDK = () =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${APPLE_PAY_SDK_URL}"]`)) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = APPLE_PAY_SDK_URL
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Apple Pay SDK'))
        document.head.appendChild(script)
      })

    const checkApplePayAvailability = async () => {
      try {
        await loadApplePaySDK()
        if (window.ApplePaySession?.canMakePayments()) {
          setApplePayAvailable(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    checkApplePayAvailability()
  }, [])

  const onClickApplePay = () => {
    const session = new ApplePaySession(apiVersion, paymentRequest)

    session.onvalidatemerchant = async ({ validationURL }) => {
      try {
        const merchantSession = await fetchMerchantSession(validationURL)
        session.completeMerchantValidation(merchantSession)
      } catch (error) {
        console.error(error)
        session.abort()
      }
    }

    if (onPaymentMethodSelected) {
      session.onpaymentmethodselected = async (event) => {
        try {
          const update = await onPaymentMethodSelected(event)
          session.completePaymentMethodSelection(update)
        } catch (error) {
          console.error(error)
          session.abort()
        }
      }
    }

    if (onShippingMethodSelected) {
      session.onshippingmethodselected = async (event) => {
        try {
          const update = await onShippingMethodSelected(event)
          session.completeShippingMethodSelection(update)
        } catch (error) {
          console.error(error)
          session.abort()
        }
      }
    }

    if (onShippingContactSelected) {
      session.onshippingcontactselected = async (event) => {
        try {
          const update = await onShippingContactSelected(event)
          session.completeShippingContactSelection(update)
        } catch (error) {
          console.error(error)
          session.abort()
        }
      }
    }

    if (onCouponCodeChanged) {
      session.oncouponcodechanged = async (event) => {
        try {
          const update = await onCouponCodeChanged(event)
          session.completeCouponCodeChange(update)
        } catch (error) {
          console.error(error)
          session.abort()
        }
      }
    }

    session.onpaymentauthorized = async ({ payment }) => {
      try {
        const result = await onPaymentAuthorized(payment)
        session.completePayment(result)
      } catch (error) {
        console.error(error)
        session.completePayment({
          status: ApplePaySession.STATUS_FAILURE
        })
      }
    }

    session.oncancel = () => {
      onPaymentCancelled?.()
    }

    session.begin()
  }

  if (!applePayAvailable) {
    return null
  }

  return (
    <apple-pay-button
      data-testid={APPLE_PAY_BUTTON_TEST_ID}
      buttonstyle={buttonStyle}
      type={type}
      onClick={onClickApplePay}
    />
  )
}

export default ApplePayButton
