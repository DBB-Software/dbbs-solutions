import { ISubscription } from './subscription.interface.js'

export interface IOrganization {
  id: number
  name: string
  quantity: number
  stripeCustomerId: string
  paymentMethodId?: string
  ownerId: number

  // TODO users

  subscription: ISubscription | number | null
  // TODO: IPurchases
  purchases?: number[]
  // TODO: ITransactions
  transactions?: number[]
  // TODO: IInvites
  invites?: number[]
  createdAt: Date
  updatedAt: Date
}

export interface ICreateOrganizationParams {
  name: string
  ownerId: number
  email: string
  quantity: number
}

export interface IUpdateOrganizationName {
  id: number
  name: string
}

export interface IUpdateOrganizationQuantity {
  id: number
  quantity: number
}

export interface IUpdateOrganizationOwner {
  id: number
  ownerId: number
}
