import { http, HttpResponse } from 'msw'
import { mockProduct, mockProductListResponse, buildProductsIdPath, buildProductsPath } from '../../data-access'

const responseOptions = {
  headers: {
    'Content-Type': 'application/json'
  },
  status: 200
}

export const productHandlers = [
  http.get(
    new RegExp(`${buildProductsPath()}(?!/)`),
    () => new HttpResponse(JSON.stringify(mockProductListResponse), responseOptions)
  ),

  http.post(new RegExp(buildProductsPath()), () => new HttpResponse(JSON.stringify(mockProduct), responseOptions)),

  http.put(
    new RegExp(buildProductsIdPath('\\s+')),
    () => new HttpResponse(JSON.stringify(mockProduct), responseOptions)
  ),

  http.delete(
    new RegExp(buildProductsIdPath('\\s+')),
    () => new HttpResponse(JSON.stringify({ success: true }), responseOptions)
  )
]
