import { StripePrice } from '@dbbs/nestjs-module-stripe'
import { BillingPeriod, Currency, PlanType } from '../../enums/index.js'
import { defaultDate, defaultDateISOString } from './date.mock.js'
import { PlanDbRecord } from '../../types/index.js'
import { PlanEntity } from '../../entites/index.js'
import { CreatePlanDto } from '../../dtos/index.js'

export const defaultRecurringPlan: PlanEntity = {
  id: 1,
  interval: BillingPeriod.MONTH,
  type: PlanType.RECURRING,
  productId: 1,
  price: 1000,
  stripeId: 'plan_1',
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const defaultOneTimePlan: PlanEntity = {
  id: 1,
  interval: null,
  type: PlanType.ONE_TIME,
  productId: 1,
  price: 1000,
  stripeId: 'plan_1',
  createdAt: defaultDate,
  updatedAt: defaultDate
}

export const dbPlansList = (baseId: number): PlanDbRecord[] => [
  {
    id: baseId + 1,
    price: 1000,
    stripeId: `plan_${baseId + 1}`,
    interval: BillingPeriod.MONTH,
    type: PlanType.RECURRING,
    productId: baseId + 1,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  },
  {
    id: baseId + 2,
    price: 2000,
    stripeId: `plan_${baseId + 2}`,
    interval: BillingPeriod.MONTH,
    type: PlanType.RECURRING,
    productId: baseId + 1,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  },
  {
    id: baseId + 3,
    price: 500,
    stripeId: `plan_${baseId + 3}`,
    interval: BillingPeriod.MONTH,
    type: PlanType.RECURRING,
    productId: baseId + 2,
    createdAt: defaultDateISOString,
    updatedAt: defaultDateISOString
  }
]

export const planEntitiesList = (baseId: number): PlanEntity[] =>
  dbPlansList(baseId).map((plan) => ({
    ...plan,
    createdAt: defaultDate,
    updatedAt: defaultDate
  }))

export const defaultPlanEntity = (baseId: number): PlanEntity => ({
  id: baseId + 1,
  interval: BillingPeriod.MONTH,
  type: PlanType.RECURRING,
  productId: baseId + 1,
  price: 1000,
  stripeId: `plan_${baseId + 1}`,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const updatedPriceFieldPlanEntity = (baseId: number) => ({
  ...defaultPlanEntity(baseId),
  price: 1200
})

export const updatedIntervalFieldsPlanEntity = (baseId: number) => ({
  ...updatedPriceFieldPlanEntity(baseId),
  interval: null,
  type: PlanType.ONE_TIME
})

export const updatedAllFieldsEntity = (baseId: number) => ({
  ...updatedIntervalFieldsPlanEntity(baseId),
  price: 1500,
  interval: BillingPeriod.YEAR,
  type: PlanType.RECURRING
})

export const stripePrice = {
  id: 'plan_1',
  lastResponse: { headers: {}, requestId: 'req_empty', statusCode: 200 }
} as StripePrice & { lastResponse: { headers: Record<string, string>; requestId: string; statusCode: number } }

export const createRecurringPlanDto: CreatePlanDto = {
  price: 1000,
  interval: BillingPeriod.MONTH,
  productId: 1,
  type: PlanType.RECURRING,
  currency: Currency.USD
}

export const createOneTimePlanDto: CreatePlanDto = {
  price: 1000,
  productId: 1,
  type: PlanType.ONE_TIME,
  currency: Currency.USD
}

export const createdRecurringPlan = (baseId: number): PlanEntity => ({
  id: baseId + 4,
  interval: BillingPeriod.MONTH,
  type: PlanType.RECURRING,
  productId: baseId + 4,
  price: 1000,
  stripeId: `plan_${baseId + 4}`,
  createdAt: defaultDate,
  updatedAt: defaultDate
})

export const createdOneTimePlan = (baseId: number): PlanEntity => ({
  id: baseId + 4,
  type: PlanType.ONE_TIME,
  productId: baseId + 4,
  price: 1000,
  interval: null,
  stripeId: `plan_${baseId + 4}`,
  createdAt: defaultDate,
  updatedAt: defaultDate
})
