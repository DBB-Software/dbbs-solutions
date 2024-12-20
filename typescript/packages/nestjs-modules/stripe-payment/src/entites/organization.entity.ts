import { SubscriptionEntity } from './subscription.entity.js'

export class OrganizationEntity {
  id: number

  name: string

  stripeCustomerId: string

  paymentMethodId?: string

  ownerId: number

  // TODO users

  subscription: SubscriptionEntity | number | null

  // TODO PurchaseEntity
  purchases?: number[]

  quantity: number

  // TODO InviteEntity
  invites?: number[]

  // TODO TransactionEntity
  transactions?: number[]

  createdAt: Date

  updatedAt: Date
}
