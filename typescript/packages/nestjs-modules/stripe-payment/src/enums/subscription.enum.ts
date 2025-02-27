export enum SubscriptionStatus {
  TRIALING = 'trialing',
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAUSED = 'paused',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid'
}

export enum SubscriptionStatusId {
  TRIALING = 1,
  ACTIVE = 2,
  CANCELED = 3,
  PAUSED = 4,
  INCOMPLETE = 5,
  INCOMPLETE_EXPIRED = 6,
  PAST_DUE = 7,
  UNPAID = 8
}
