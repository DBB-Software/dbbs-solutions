import { User } from './user.interfaces.ts'
import { Subscription } from './subscription.interfaces.ts'

export interface Organization {
  id: number
  name: string
  customer_id: string
  payment_method_id: string
  owner_id: string
  quantity: number
  createdAt: string
  updatedAt: string
  users: User[]
  subscription: Subscription
}
