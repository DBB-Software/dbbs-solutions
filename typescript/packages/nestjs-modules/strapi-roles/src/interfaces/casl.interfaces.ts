export interface Condition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin'
  value: string | number | string[] | number[]
}

export interface AbilityOptions {
  permissions: string[]
  conditions?: Condition[]
}
