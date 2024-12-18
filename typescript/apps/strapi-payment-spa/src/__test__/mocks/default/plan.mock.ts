import { Plan } from '../../../interfaces'
import { PlanType } from '../../../enums'

export const mockPlan: Plan = {
  id: 1,
  price: 10,
  createdAt: '2021-01-01T00:00:00.000Z',
  stripe_id: 'price_123',
  interval: '',
  updatedAt: null,
  type: PlanType.Onetime
}
