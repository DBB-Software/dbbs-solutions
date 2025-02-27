import { FC } from 'react'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

import { useLoadStripe } from '../useLoadStripe'

type EmbeddedCheckoutProviderOptions = Parameters<typeof EmbeddedCheckoutProvider>[0]['options']
type EmbeddedCheckoutPropsBase = Parameters<typeof EmbeddedCheckout>[0]

export type StripeEmbeddedCheckoutProps = {
  stripePublicKey: string
  options: EmbeddedCheckoutProviderOptions
} & EmbeddedCheckoutPropsBase

const StripeEmbeddedCheckout: FC<StripeEmbeddedCheckoutProps> = ({ stripePublicKey, options, ...checkoutProps }) => {
  const stripePromise = useLoadStripe(stripePublicKey)

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout {...checkoutProps} />
    </EmbeddedCheckoutProvider>
  )
}

export default StripeEmbeddedCheckout
