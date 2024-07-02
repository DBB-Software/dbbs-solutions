export interface CreateCheckoutSessionParams {
  organizationName: string
  quantity: number
  planId: number
  userId: number
}

export interface CancelSubscriptionParams {
  id: number
}

export interface PauseSubscriptionParams {
  id: number
}

export interface ResumeSubscriptionParams {
  id: number
}

export interface GetSubscriptionByIdParams {
  id: number
}

export interface GetMySubscriptionParams {
  userId: number
}

export interface DeleteSubscriptionParams {
  id: number
}

export interface UpdateSubscriptionParams {
  id: number
  quantity?: number
  planId?: number
}

export interface ResubscribeParams {
  id: number
}
