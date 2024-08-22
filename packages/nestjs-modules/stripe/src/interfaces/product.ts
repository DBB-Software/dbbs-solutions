export interface ICreateProductParams {
  name: string
}

export interface IUpdateProductParams {
  name: string
  id: string
}

export interface IGetProductByIdParams {
  id: string
}

export interface IDeleteProductParams {
  id: string
}
