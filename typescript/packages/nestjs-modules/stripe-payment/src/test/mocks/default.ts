import { StripeCheckoutSession } from '@dbbs/nestjs-module-stripe'

export const SUCCESS_URL = 'https://success.com'
export const CHECKOUT_SESSION_URL = 'https://checkout-session.com'

export const defaultCheckoutSession = {
  url: 'https://checkout-session.com',
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
} as StripeCheckoutSession & {
  lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number }
}
