import { GridSortDirection } from '@mui/x-data-grid'

export type UpdatePayload<T extends object> = {
  id: string
  item: Partial<T>
}

export type ListPayload = {
  limit?: number
  offset?: number
  filterField?: string
  filterOperator?: string
  filterValue?: string
  sortBy?: string
  sortOrder?: GridSortDirection
}

export type ListResponse<T extends object> = {
  cursor: number
  count: number
  remaining: number
  results: T[]
}

export type LinkField = {
  id: string
  name: string
  fullName: string
}
