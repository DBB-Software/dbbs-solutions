// eslint-disable-next-line max-classes-per-file
import { IsInt, IsUrl, Min } from 'class-validator'
import { SubscriptionStatus } from '../enums/index.js'
import { OrganizationDto } from './organization.dto.js'
import { PlanDto } from './plan.dto.js'

export class SubscriptionDto {
  id: number

  stripeId: string

  organization: OrganizationDto | number

  plan: PlanDto | number

  status: SubscriptionStatus | number

  quantity: number

  createdAt: Date

  updatedAt: Date
}

export class UpdateSubscriptionQuantityDto {
  @IsInt()
  @Min(1)
  quantity: number
}

export class CreateCheckoutSessionDto {
  @IsInt()
  @Min(1)
  quantity: number

  @IsInt()
  planId: number

  @IsInt()
  userId: number

  @IsUrl()
  successUrl: string

  @IsInt()
  organizationId: number
}
