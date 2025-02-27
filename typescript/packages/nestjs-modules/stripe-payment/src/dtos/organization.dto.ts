// eslint-disable-next-line max-classes-per-file
import { IsNumber, IsPositive, IsString, IsEmail } from 'class-validator'

import { SubscriptionDto } from './subscription.dto.js'

export class OrganizationDto {
  id: number

  name: string

  stripeCustomerId: string

  paymentMethodId?: string

  ownerId: number

  // TODO users

  subscription: SubscriptionDto | number | null

  // TODO PurchasesDto
  purchases?: number[]

  quantity: number

  // TODO TransactionsDto
  transactions?: number[]

  // TODO InvitesDto
  invites?: number[]

  createdAt: Date

  updatedAt: Date
}

export class CreateOrganizationDto {
  @IsString()
  name: string

  @IsNumber()
  ownerId: number

  @IsEmail()
  email: string

  @IsNumber()
  @IsPositive()
  quantity: number
}

export class UpdateOrganizationNameDto {
  @IsString()
  name: string
}

export class UpdateOrganizationQuantityDto {
  @IsNumber()
  @IsPositive()
  quantity: number
}

export class UpdateOrganizationOwnerDto {
  @IsNumber()
  @IsPositive()
  ownerId: number
}

export class AcceptInviteDto {
  @IsNumber()
  @IsPositive()
  userId: number
}
