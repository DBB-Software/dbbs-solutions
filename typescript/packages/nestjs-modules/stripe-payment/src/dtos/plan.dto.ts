// eslint-disable-next-line max-classes-per-file
import { IsEnum, IsNumber, IsPositive, ValidateIf, IsDefined } from 'class-validator'
import { BillingPeriod, Currency, PlanType } from '../enums/index.js'

export class PlanDto {
  id: number

  price: number

  stripeId: string

  interval: BillingPeriod | null

  type: PlanType

  productId: number

  createdAt: Date

  updatedAt: Date
}

export class CreatePlanDto {
  @IsNumber()
  @IsPositive()
  price: number

  @ValidateIf((obj) => obj.type === PlanType.RECURRING)
  @IsDefined({ message: 'You cannot create a recurring plan without specifying an interval' })
  @IsEnum(BillingPeriod)
  interval?: BillingPeriod

  @IsNumber()
  productId: number

  @IsEnum(PlanType)
  type: PlanType

  @IsEnum(Currency)
  currency: Currency
}
