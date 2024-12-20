export type CheckoutSessionRequestParams = {
  organizationName?: string
  quantity: number
  planId: number
  organizationId?: number
}

export type CheckoutSessionResponse = {
  url: string
}
