export class CheckoutSessionMetadataEntity {
  id: number

  checkoutSessionStripeId: string

  organizationId: number

  planId: number

  quantity: number

  createdAt: Date

  updatedAt: Date
}
