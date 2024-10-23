export interface IPaginatedResponse<T> {
  total: number
  page: number
  perPage: number
  items: T[]
}

export interface IPaginationOptions {
  page?: number
  perPage?: number
}
