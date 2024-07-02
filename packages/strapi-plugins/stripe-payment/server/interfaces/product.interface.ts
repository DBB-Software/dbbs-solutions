export interface CreateProductParams {
  name: string
}

export interface UpdateProductParams {
  name: string
  id: number
}

export interface GetProductByIdParams {
  id: number
}

export interface DeleteProductParams {
  id: number
}
