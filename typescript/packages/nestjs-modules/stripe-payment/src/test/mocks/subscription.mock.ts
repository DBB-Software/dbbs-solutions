import { StripeSubscription } from '@dbbs/nestjs-module-stripe'
import { SubscriptionEntity } from '../../entites/index.js'
import { BillingPeriod, PlanType, SubscriptionStatus, SubscriptionStatusId } from '../../enums/index.js'
import { defaultRecurringPlan } from './plan.mock.js'
import { defaultDate, defaultDateISOString } from './date.mock.js'
import { defaultOrganization, defaultOrganizationEntity } from './organization.mock.js'

export const defaultSubscription: SubscriptionEntity = {
  id: 1,
  stripeId: 'sub_1',
  plan: 1,
  status: SubscriptionStatusId.ACTIVE,
  organization: 1,
  quantity: 5,
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const extendedSubscription: SubscriptionEntity = {
  id: 1,
  stripeId: 'sub_1',
  plan: defaultRecurringPlan,
  status: SubscriptionStatus.ACTIVE,
  organization: defaultOrganization,
  quantity: 5,
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const dbSubscriptionsList = (baseId: number) =>
  Array.from({ length: 15 }, (_, index) => ({
    id: index + baseId + 1,
    stripeId: `sub_${index + baseId + 1}`,
    planId: baseId + 1,
    statusId: SubscriptionStatusId.TRIALING,
    organizationId: index + baseId + 1,
    quantity: 5,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }))

export const resubscribedDbSubscription = (baseId: number) => ({
  id: baseId + 1,
  stripeId: 'stripe_id',
  planId: baseId + 1,
  statusId: SubscriptionStatusId.CANCELED,
  organizationId: baseId + 1,
  quantity: 3,
  createdAt: defaultDateISOString,
  updatedAt: defaultDateISOString
})

export const defaultSubscriptionEntity = (baseId: number): SubscriptionEntity => ({
  id: baseId + 1,
  stripeId: `sub_${baseId + 1}`,
  plan: baseId + 1,
  status: SubscriptionStatusId.TRIALING,
  organization: baseId + 1,
  quantity: 5,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const secondSubscriptionEntity = (baseId: number): SubscriptionEntity => ({
  ...defaultSubscriptionEntity(baseId),
  id: baseId + 2,
  stripeId: `sub_${baseId + 2}`,
  organization: baseId + 2
})

export const thirdSubscriptionEntity = (baseId: number): SubscriptionEntity => ({
  ...defaultSubscriptionEntity(baseId),
  id: baseId + 3,
  stripeId: `sub_${baseId + 3}`,
  organization: baseId + 3
})

export const populatedSubscriptionEntity = (baseId: number): SubscriptionEntity => ({
  id: baseId + 1,
  stripeId: `sub_${baseId + 1}`,
  plan: {
    id: baseId + 1,
    price: 1000,
    stripeId: `plan_${baseId + 1}`,
    interval: BillingPeriod.MONTH,
    type: PlanType.RECURRING,
    productId: baseId + 1,
    createdAt: defaultDate,
    updatedAt: defaultDate
  },
  status: SubscriptionStatus.TRIALING,
  organization: defaultOrganizationEntity(baseId),
  quantity: 5,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const stripeSubscription = {
  id: 'sub_1',
  items: {
    data: [
      {
        quantity: 7
      }
    ]
  },
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
} as StripeSubscription & { lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number } }
