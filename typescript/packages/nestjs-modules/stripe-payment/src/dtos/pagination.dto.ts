// eslint-disable-next-line max-classes-per-file
import { IsNumber, IsOptional, IsPositive } from 'class-validator'
import { Transform } from 'class-transformer'

// TODO (#1328): Add package with types for pagination
export class PaginationOptionsDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  page?: number

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  perPage?: number
}

export class PaginatedResponseDto<T> {
  total: number

  page: number

  perPage: number

  items: T[]
}
