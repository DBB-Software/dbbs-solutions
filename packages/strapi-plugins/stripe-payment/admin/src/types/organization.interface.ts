import { Plan } from './product.interface'

export enum SubscriptionStatus {
  TRIALING = 'trialing',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
  UNPAID = 'unpaid'
}

export interface User {
  id: string
  email: string
  username: string
}

export interface Subscription {
  id: string
  stripe_id: string
  plan: Plan
  status: SubscriptionStatus
  quantity: number
}

export interface Purchase {
  id: string
  stripe_id: string
  plan: Plan
}

export interface Organization {
  id: string
  name: string
  users: User[]
  subscription: Subscription | null
  owner_id: string
  purchases: Purchase[]
}
