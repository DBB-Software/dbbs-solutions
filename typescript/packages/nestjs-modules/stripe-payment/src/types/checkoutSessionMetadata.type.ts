export type CreateCheckoutSessionMetadataPayload = {
  checkoutSessionStripeId: string
  organizationId: number
  quantity: number
  planId: number
}

export type CheckoutSessionMetadataDbRecord = {
  id: number
  checkoutSessionStripeId: string
  organizationId: number
  planId: number
  quantity: number
  createdAt: string
  updatedAt: string
}
