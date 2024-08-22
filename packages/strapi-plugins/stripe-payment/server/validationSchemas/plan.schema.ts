import * as yup from 'yup'
import { BillingPeriod, PlanType } from '../enums'

export const createPlanSchema = yup.object().shape({
  price: yup.number().required().min(0),
  interval: yup.mixed<BillingPeriod>().oneOf(Object.values(BillingPeriod)),
  productId: yup.number().required(),
  type: yup.mixed<PlanType>().oneOf(Object.values(PlanType)).required()
})

export const getPlanByIdSchema = yup.object().shape({
  id: yup.number().required()
})

export const deletePlanSchema = yup.object().shape({
  id: yup.number().required()
})
