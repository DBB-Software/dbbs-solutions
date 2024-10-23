// eslint-disable-next-line max-classes-per-file
import { IsString, Length } from 'class-validator'
import { PlanDto } from './plan.dto.js'

export class ProductDto {
  id: number

  name: string

  stripeId: string

  plans?: PlanDto[]

  createdAt: Date

  updatedAt: Date
}

export class CreateProductDto {
  @IsString()
  @Length(3, 50)
  name: string
}

export class UpdateProductDto {
  @IsString()
  @Length(3, 50)
  name: string
}
