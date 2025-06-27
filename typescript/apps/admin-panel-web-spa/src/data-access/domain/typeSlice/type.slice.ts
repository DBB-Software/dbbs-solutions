import { ListPayload, ListResponse, Type, UpdatePayload } from '../../../types'
import { buildQueryParams } from '../../../utils'
import { apiSlice, ApiSliceTag } from '../apiSlice'

export const TYPE_URL_SEGMENTS = {
  TYPES: 'types'
}

export const buildTypesPath = () => `/${TYPE_URL_SEGMENTS.TYPES}`
export const buildTypesIdPath = (id: string) => `/${TYPE_URL_SEGMENTS.TYPES}/${id}`

export const typeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createType: builder.mutation<Type, Partial<Type>>({
      query: (body) => ({
        url: buildTypesPath(),
        method: 'POST',
        body
      }),
      invalidatesTags: [ApiSliceTag.Type]
    }),
    updateType: builder.mutation<Type, UpdatePayload<Type>>({
      query: ({ id, item }) => ({
        url: buildTypesIdPath(id),
        method: 'PATCH',
        body: item
      }),
      invalidatesTags: [ApiSliceTag.Type]
    }),
    deleteType: builder.mutation<void, string>({
      query: (typeId) => ({
        url: buildTypesIdPath(typeId),
        method: 'DELETE'
      }),
      invalidatesTags: [ApiSliceTag.Type]
    }),
    getTypeList: builder.query<ListResponse<Type>, ListPayload>({
      query: (query) => {
        const params = buildQueryParams(query)

        return {
          url: `${buildTypesPath()}?${params.toString()}`,
          method: 'GET'
        }
      },
      providesTags: [ApiSliceTag.Type]
    })
  })
})

export const selectDomainGetTypeList = typeSlice.endpoints.getTypeList.select

export const { useGetTypeListQuery, useCreateTypeMutation, useUpdateTypeMutation, useDeleteTypeMutation } = typeSlice
