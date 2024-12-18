// eslint-disable-next-line max-classes-per-file
import { IsInt, IsString, IsUrl, Min, MinLength, ValidateIf, IsOptional, IsDefined } from 'class-validator'
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

  @IsOptional()
  @IsString()
  @MinLength(1)
  organizationName?: string

  @IsOptional()
  @IsInt()
  organizationId?: number

  @ValidateIf(
    (dto) =>
      (dto.organizationName !== undefined && dto.organizationId !== undefined) ||
      (dto.organizationName === undefined && dto.organizationId === undefined)
  )
  @IsDefined({ message: 'You must provide either organizationName or organizationId, but not both' })
  protected readonly organizationNameOrIdCheck?: undefined
}
