import { CreateCheckoutSessionMetadataPayload } from '../../types/index.js'
import { defaultDate, defaultDateISOString } from './date.mock.js'

export const createCheckoutSessionMetadataPayload = (baseId: number): CreateCheckoutSessionMetadataPayload => ({
  checkoutSessionStripeId: `cs_${baseId + 1}`,
  organizationName: `Organization ${baseId + 1}`,
  planId: baseId + 1,
  userId: baseId + 1,
  quantity: 2
})

export const dbCheckoutSessionMetadataList = (baseId: number) => [
  {
    id: baseId + 1,
    checkoutSessionStripeId: `cs_${baseId + 1}`,
    organizationName: 'Organization 1',
    planId: baseId + 1,
    userId: baseId + 1,
    quantity: 2,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }
]

export const defaultCheckoutSessionMetadataEntity = (baseId: number) => ({
  id: baseId + 1,
  checkoutSessionStripeId: `cs_${baseId + 1}`,
  organizationName: 'Organization 1',
  planId: baseId + 1,
  userId: baseId + 1,
  quantity: 2,
  createdAt: defaultDate,
  updatedAt: defaultDate
})
