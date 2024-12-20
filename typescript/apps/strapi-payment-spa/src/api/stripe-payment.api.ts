import { FetchData, createSecuredApi } from '../utils/api'
import {
  CheckoutSessionRequestParams,
  CheckoutSessionResponse,
  GetOrganizationsResponse,
  GetProductsResponse,
  UpdateOrganizationRequestParams
} from '../types'
import { Organization, Subscription } from '../interfaces'

export const stripePaymentApi = (params: FetchData) => {
  const { endpoint, ...rest } = params
  return createSecuredApi({
    endpoint: `/stripe-payment/api${endpoint}`,
    ...rest
  })
}

export const getProducts = (): Promise<GetProductsResponse[]> =>
  stripePaymentApi({ endpoint: '/products', method: 'GET' })

export const getOrganization = async (organizationId: string): Promise<Organization> =>
  stripePaymentApi({ endpoint: `/organizations/${organizationId}`, method: 'GET' })

export const getOrganizations = (): Promise<GetOrganizationsResponse> =>
  stripePaymentApi({ endpoint: '/organizations', method: 'GET' })

export const postCheckoutSession = (data: CheckoutSessionRequestParams): Promise<CheckoutSessionResponse> =>
  stripePaymentApi({ endpoint: '/subscriptions/checkout-session', method: 'POST', data })

export const updateOrganization = async (
  organizationId: number,
  data: UpdateOrganizationRequestParams
): Promise<Organization> => stripePaymentApi({ endpoint: `/organizations/${organizationId}`, method: 'PUT', data })

export const updateOrganizationOwner = async (organizationId: number, ownerId: string): Promise<Organization> =>
  stripePaymentApi({ endpoint: `/organizations/${organizationId}/change-owner`, method: 'PATCH', data: { ownerId } })

export const addUserToOrganization = async (organizationId: number, recipientEmail: string): Promise<Organization> =>
  stripePaymentApi({ endpoint: `/organizations/${organizationId}/add-user`, method: 'PATCH', data: { recipientEmail } })

export const removeUserFromOrganization = async (organizationId: number, userId: string): Promise<Organization> =>
  stripePaymentApi({ endpoint: `/organizations/${organizationId}/remove-user/${userId}`, method: 'PATCH' })

export const pauseSubscription = async (subscriptionId: number): Promise<Subscription> =>
  stripePaymentApi({ endpoint: `/subscriptions/${subscriptionId}/pause`, method: 'PATCH' })

export const resumeSubscription = async (subscriptionId: number): Promise<Subscription> =>
  stripePaymentApi({ endpoint: `/subscriptions/${subscriptionId}/resume`, method: 'PATCH' })

export const cancelSubscription = async (subscriptionId: number): Promise<Subscription> =>
  stripePaymentApi({ endpoint: `/subscriptions/${subscriptionId}/cancel`, method: 'PATCH' })

export const updateSubscription = async (subscriptionId: number, data: { quantity: number }): Promise<Subscription> =>
  stripePaymentApi({ endpoint: `/subscriptions/${subscriptionId}/update`, method: 'PATCH', data })

export const resubscribeSubscription = async (subscriptionId: number): Promise<Subscription> =>
  stripePaymentApi({ endpoint: `/subscriptions/${subscriptionId}/resubscribe`, method: 'PATCH' })

export const getSubscriptionDetails = async (subscriptionId: number): Promise<Subscription> =>
  stripePaymentApi({ endpoint: `/subscriptions/${subscriptionId}`, method: 'GET' })
