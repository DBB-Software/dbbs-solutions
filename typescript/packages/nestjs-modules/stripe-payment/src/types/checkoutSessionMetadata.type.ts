export type CreateCheckoutSessionMetadataPayload = {
  checkoutSessionStripeId: string
  organizationName: string
  quantity: number
  userId: number
  planId: number
}

export type CheckoutSessionMetadataDbRecord = {
  id: number
  checkoutSessionStripeId: string
  organizationName: string
  planId: number
  userId: number
  quantity: number
  createdAt: string
  updatedAt: string
}
