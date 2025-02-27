import { useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const useLoadStripe = (stripePublicKey: string) =>
  useMemo(() => {
    try {
      return loadStripe(stripePublicKey)
    } catch (error) {
      console.error('Failed to load Stripe:', error)
      return Promise.resolve(null)
    }
  }, [stripePublicKey])

export default useLoadStripe
