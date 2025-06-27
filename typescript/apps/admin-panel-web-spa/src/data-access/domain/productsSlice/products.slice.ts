import { Product, ListPayload, ListResponse, UpdatePayload } from '../../../types'
import { buildQueryParams } from '../../../utils'
import { apiSlice, ApiSliceTag } from '../apiSlice'

export const PRODUCT_URL_SEGMENTS = {
  PRODUCT: 'products',
  PROPERTIES: 'properties'
}

export const buildProductsPath = () => `/${PRODUCT_URL_SEGMENTS.PRODUCT}`
export const buildProductsIdPath = (id: string) => `/${PRODUCT_URL_SEGMENTS.PRODUCT}/${id}`
export const buildProductsPropertiesPath = () => `/${PRODUCT_URL_SEGMENTS.PRODUCT}/${PRODUCT_URL_SEGMENTS.PROPERTIES}`

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: buildProductsPath(),
        method: 'POST',
        body
      })
    }),
    updateProduct: builder.mutation<Product, UpdatePayload<Product>>({
      query: ({ id, item }) => ({
        url: buildProductsIdPath(id),
        method: 'PATCH',
        body: item
      }),
      invalidatesTags: [ApiSliceTag.Products]
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (productId) => ({
        url: buildProductsIdPath(productId),
        method: 'DELETE'
      }),
      invalidatesTags: [ApiSliceTag.Products]
    }),
    getProductList: builder.query<ListResponse<Product>, ListPayload>({
      query: (query) => {
        const params = buildQueryParams(query)

        return {
          url: `${buildProductsPath()}?${params.toString()}`,
          method: 'GET'
        }
      },
      providesTags: [ApiSliceTag.Products]
    }),
    getProductById: builder.query<Product, string>({
      query: buildProductsIdPath
    })
  })
})

export const selectDomainGetProductList = productSlice.endpoints.getProductList.select

export const {
  useGetProductListQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery
} = productSlice
