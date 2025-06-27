import { Product, ListResponse, UpdatePayload } from '../../../types'

export const mockProduct: Product = {
  id: 1,
  name: 'Onslow County School Board'
}

export const getMockProductList = (totalCount: number): Product[] =>
  Array.from(Array(totalCount)).map((_, index) => ({
    ...mockProduct,
    id: index + 1
  }))

export const mockProductListResponse: ListResponse<Product> = {
  count: 10,
  cursor: 0,
  remaining: 90,
  results: [mockProduct]
}

export const mockUpdateProductPayload: UpdatePayload<Product> = {
  id: String(mockProduct.id),
  item: mockProduct
}

export const mockProductTypes = ['Type 1', 'Type 2', 'Type 3']
