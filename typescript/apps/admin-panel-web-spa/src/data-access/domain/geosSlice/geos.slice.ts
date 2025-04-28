import { Geo, ListPayload, ListResponse, UpdatePayload } from '../../../types'
import { buildQueryParams } from '../../../utils'
import { apiSlice, ApiSliceTag } from '../apiSlice'

export const GEO_URL_SEGMENTS = {
  GEOS: 'geos',
  PROPERTIES: 'properties'
}

export const buildGeosPath = () => `/${GEO_URL_SEGMENTS.GEOS}`
export const buildGeosIdPath = (id: string) => `/${GEO_URL_SEGMENTS.GEOS}/${id}`
export const buildGeosPropertiesPath = () => `/${GEO_URL_SEGMENTS.GEOS}/${GEO_URL_SEGMENTS.PROPERTIES}`

export const geoSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGeo: builder.mutation<Geo, Partial<Geo>>({
      query: (body) => ({
        url: buildGeosPath(),
        method: 'POST',
        body
      })
    }),
    updateGeo: builder.mutation<Geo, UpdatePayload<Geo>>({
      query: ({ id, item }) => ({
        url: buildGeosIdPath(id),
        method: 'PATCH',
        body: item
      }),
      invalidatesTags: [ApiSliceTag.Geos]
    }),
    deleteGeo: builder.mutation<void, string>({
      query: (geoId) => ({
        url: buildGeosIdPath(geoId),
        method: 'DELETE'
      }),
      invalidatesTags: [ApiSliceTag.Geos]
    }),
    getGeoList: builder.query<ListResponse<Geo>, ListPayload>({
      query: (query) => {
        const params = buildQueryParams(query)

        return {
          url: `${buildGeosPath()}?${params.toString()}`,
          method: 'GET'
        }
      },
      providesTags: [ApiSliceTag.Geos]
    }),
    getGeoById: builder.query<Geo, string>({
      query: buildGeosIdPath
    })
  })
})

export const selectDomainGetGeoList = geoSlice.endpoints.getGeoList.select

export const {
  useGetGeoListQuery,
  useCreateGeoMutation,
  useUpdateGeoMutation,
  useDeleteGeoMutation,
  useGetGeoByIdQuery
} = geoSlice
