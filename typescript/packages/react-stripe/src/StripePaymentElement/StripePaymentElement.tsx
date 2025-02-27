import { PropsWithChildren, FC, useCallback, FormEvent } from 'react'
import { Elements, PaymentElement, PaymentElementProps, useElements, useStripe } from '@stripe/react-stripe-js'
import { Appearance, ConfirmPaymentData } from '@stripe/stripe-js'

import { useLoadStripe } from '../useLoadStripe'

export type StripePaymentElementFormProps = {
  confirmParams: ConfirmPaymentData
} & PaymentElementProps

export type StripePaymentElementProps = {
  stripePublicKey: string
  clientSecret: string
  appearance?: Appearance
  loader?: 'auto' | 'always' | 'never'
} & StripePaymentElementFormProps

const StripePaymentElementForm: FC<PropsWithChildren<StripePaymentElementFormProps>> = ({
  confirmParams,
  children,
  ...props
}) => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!stripe || !elements) {
        return
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams
      })

      if (error) {
        console.error(error.message)
      }
    },
    [stripe, elements, confirmParams]
  )

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement {...props} />
      {children}
    </form>
  )
}

const StripePaymentElement: FC<PropsWithChildren<StripePaymentElementProps>> = ({
  stripePublicKey,
  clientSecret,
  appearance,
  loader,
  ...props
}) => {
  const stripePromise = useLoadStripe(stripePublicKey)

  return (
    <Elements
      options={{
        clientSecret,
        appearance,
        loader
      }}
      stripe={stripePromise}
    >
      <StripePaymentElementForm {...props} />
    </Elements>
  )
}

export default StripePaymentElement
