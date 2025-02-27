import { PlanType } from '../../../enums'
import { GetProductsResponse } from '../../../types'

export const mockInitialProductsArray: GetProductsResponse[] = [
  {
    id: 1,
    name: 'Inspirings Solutions',
    plans: [
      {
        id: 1,
        price: 10,
        createdAt: '2021-01-01T00:00:00.000Z',
        stripe_id: 'price_123',
        interval: '',
        updatedAt: null,
        type: PlanType.Recurring
      },
      {
        id: 2,
        price: 20,
        interval: '',
        createdAt: '2021-01-01T00:00:00.000Z',
        stripe_id: 'price_123',
        updatedAt: null,
        type: PlanType.Onetime
      }
    ],
    stripe_id: '',
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2021-01-01T00:00:00.000Z'
  }
]
