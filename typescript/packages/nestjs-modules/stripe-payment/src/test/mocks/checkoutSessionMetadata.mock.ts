import { CreateCheckoutSessionMetadataPayload } from '../../types/index.js'
import { defaultDate, defaultDateISOString } from './date.mock.js'

export const createCheckoutSessionMetadataPayload = (baseId: number): CreateCheckoutSessionMetadataPayload => ({
  checkoutSessionStripeId: `cs_${baseId + 1}`,
  organizationId: baseId + 1,
  planId: baseId + 1,
  quantity: 2
})

export const dbCheckoutSessionMetadataList = (baseId: number) => [
  {
    id: baseId + 1,
    checkoutSessionStripeId: `cs_${baseId + 1}`,
    organizationId: 1,
    planId: baseId + 1,
    quantity: 2,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }
]

export const defaultCheckoutSessionMetadataEntity = (baseId: number) => ({
  id: baseId + 1,
  checkoutSessionStripeId: `cs_${baseId + 1}`,
  organizationId: 1,
  planId: baseId + 1,
  quantity: 2,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const defaultCheckoutSessionMetadata = {
  id: 1,
  checkoutSessionStripeId: 'cs_1',
  organizationId: 1,
  planId: 1,
  quantity: 2,
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const invalidCheckoutSessionMetadata = {
  id: -1,
  checkoutSessionStripeId: '',
  organizationId: 0,
  planId: -5,
  quantity: 0,
  createdAt: defaultDate,
  updatedAt: defaultDate
}
