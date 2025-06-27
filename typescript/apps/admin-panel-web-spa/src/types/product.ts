import { Type } from './type'

export type Product = {
  id: number
  typeId?: number
  name?: string
  description?: string
  price?: number
  currency?: string
  sku?: string
  inventoryCount?: number
  imageUrl?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  type?: Type
}
