import { SubscriptionDbRecord } from './subscription.type.js'

export type OrganizationDbRecord = {
  id: number
  name: string
  stripeCustomerId: string
  paymentMethodId?: string
  ownerId: number
  // TODO InviteDbRecord
  invites?: number[]
  subscription: SubscriptionDbRecord | number | null
  // TODO PurchasesDbRecord
  purchases?: number[]
  quantity: number
  // TODO TransactionDbRecord
  transactions?: number[]
  createdAt: string
  updatedAt: string
}

export type CreateOrganizationPayload = {
  name: string
  stripeCustomerId: string
  ownerId: number
  quantity: number
}

export type AddUserToOrganizationPayload = {
  organizationId: number
  userId: number
}

export type UpdateOrganizationPayload = Partial<OrganizationDbRecord> & {
  id: number
}

export type RemoveUserFromOrganizationPayload = {
  userId: number
  organizationId: number
}
