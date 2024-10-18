import { StripeProduct } from '@dbbs/nestjs-module-stripe'
import { ProductEntity } from '../../entites/index.js'
import { BillingPeriod, PlanType } from '../../enums/index.js'
import { defaultDate, defaultDateISOString } from './date.mock.js'
import { ProductDbRecord } from '../../types/index.js'

export const defaultProduct: ProductEntity = {
  id: 1,
  stripeId: 'prod_1',
  name: 'Product 1',
  plans: [
    {
      id: 1,
      stripeId: 'plan_1',
      type: PlanType.RECURRING,
      price: 1000,
      interval: BillingPeriod.MONTH,
      productId: 1,
      createdAt: defaultDate,
      updatedAt: defaultDate
    }
  ],
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const productWithoutPlans: ProductEntity = {
  id: 1,
  stripeId: 'prod_1',
  name: 'Product 1',
  plans: [],
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const dbProductsList = (baseId: number): ProductDbRecord[] =>
  Array.from({ length: 15 }, (_, index) => ({
    id: baseId + index + 1,
    name: `Product ${baseId + index + 1}`,
    stripeId: `prod_${baseId + index + 1}`,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }))

export const defaultProductEntity = (baseId: number): ProductEntity => ({
  id: baseId + 1,
  name: `Product ${baseId + 1}`,
  stripeId: `prod_${baseId + 1}`,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const productEntityWithTwoPlans = (baseId: number): ProductEntity => ({
  id: baseId + 1,
  name: `Product ${baseId + 1}`,
  stripeId: `prod_${baseId + 1}`,
  plans: [
    {
      id: baseId + 1,
      price: 1000,
      stripeId: `plan_${baseId + 1}`,
      interval: BillingPeriod.MONTH,
      type: PlanType.RECURRING,
      productId: baseId + 1,
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
    {
      id: baseId + 2,
      price: 2000,
      stripeId: `plan_${baseId + 2}`,
      interval: BillingPeriod.MONTH,
      type: PlanType.RECURRING,
      productId: baseId + 1,
      createdAt: defaultDate,
      updatedAt: defaultDate
    }
  ],
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const productEntityWithOnePlan = (baseId: number): ProductEntity => ({
  id: baseId + 2,
  name: `Product ${baseId + 2}`,
  stripeId: `prod_${baseId + 2}`,
  plans: [
    {
      id: baseId + 3,
      price: 500,
      stripeId: `plan_${baseId + 3}`,
      interval: BillingPeriod.MONTH,
      type: PlanType.RECURRING,
      productId: baseId + 2,
      createdAt: defaultDate,
      updatedAt: defaultDate
    }
  ],
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const productEntityWithZeroPlans = (baseId: number): ProductEntity => ({
  id: baseId + 3,
  name: `Product ${baseId + 3}`,
  stripeId: `prod_${baseId + 3}`,
  plans: [],
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const createdProduct = (baseId: number): ProductEntity => ({
  id: baseId + 16,
  name: `Product ${baseId + 16}`,
  stripeId: `prod_${baseId + 16}`,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const stripeProduct = {
  id: 'prod_1',
  name: 'Product 1'
} as StripeProduct

export const deletedProduct = {
  id: 1
}

export const createProductDto = {
  name: 'Product 1'
}
