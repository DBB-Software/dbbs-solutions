import { StripeSubscriptionStatus } from '@dbbs/nestjs-module-stripe'
import { SubscriptionStatus, SubscriptionStatusId } from '../enums/index.js'

const stripeToSubscriptionStatusMap: Record<StripeSubscriptionStatus, SubscriptionStatus> = {
  trialing: SubscriptionStatus.TRIALING,
  active: SubscriptionStatus.ACTIVE,
  canceled: SubscriptionStatus.CANCELED,
  paused: SubscriptionStatus.PAUSED,
  incomplete: SubscriptionStatus.INCOMPLETE,
  incomplete_expired: SubscriptionStatus.INCOMPLETE_EXPIRED,
  past_due: SubscriptionStatus.PAST_DUE,
  unpaid: SubscriptionStatus.UNPAID
}

const subscriptionStatusToStatusIdMap: Record<SubscriptionStatus, SubscriptionStatusId> = {
  [SubscriptionStatus.TRIALING]: SubscriptionStatusId.TRIALING,
  [SubscriptionStatus.ACTIVE]: SubscriptionStatusId.ACTIVE,
  [SubscriptionStatus.CANCELED]: SubscriptionStatusId.CANCELED,
  [SubscriptionStatus.PAUSED]: SubscriptionStatusId.PAUSED,
  [SubscriptionStatus.INCOMPLETE]: SubscriptionStatusId.INCOMPLETE,
  [SubscriptionStatus.INCOMPLETE_EXPIRED]: SubscriptionStatusId.INCOMPLETE_EXPIRED,
  [SubscriptionStatus.PAST_DUE]: SubscriptionStatusId.PAST_DUE,
  [SubscriptionStatus.UNPAID]: SubscriptionStatusId.UNPAID
}

export function mapStripeToSubscriptionStatus(stripeStatus: StripeSubscriptionStatus): SubscriptionStatus {
  return stripeToSubscriptionStatusMap[stripeStatus]
}

export function mapSubscriptionStatusToStatusId(subscriptionStatus: SubscriptionStatus): SubscriptionStatusId {
  return subscriptionStatusToStatusIdMap[subscriptionStatus]
}
