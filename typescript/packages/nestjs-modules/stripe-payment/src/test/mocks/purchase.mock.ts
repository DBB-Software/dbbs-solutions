import { defaultDate, defaultDateISOString } from './date.mock.js'
import { defaultRecurringPlan } from './plan.mock.js'
import { PurchaseEntity } from '../../entites/index.js'
import { CreatePurchasePayload } from '../../types/index.js'

export const dbPurchasesList = (baseId: number) => [
  ...Array.from({ length: 14 }, (_, index) => ({
    id: baseId + index + 1,
    stripeId: `purch_${baseId + index + 1}`,
    planId: baseId + (index % 3) + 1,
    organizationId: baseId + 1,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  })),
  {
    id: baseId + 15,
    stripeId: `purch_${baseId + 15}`,
    planId: baseId + 1,
    organizationId: baseId + 2,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }
]

export const defaultPurchase: PurchaseEntity = {
  id: 1,
  stripeId: `purch_1`,
  plan: defaultRecurringPlan,
  organizationId: 1,
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const mockCreatePurchasePayload = (baseId: number): CreatePurchasePayload => ({
  stripeId: `purch_${baseId + 16}`,
  planId: baseId + 1,
  organizationId: baseId + 9
})
