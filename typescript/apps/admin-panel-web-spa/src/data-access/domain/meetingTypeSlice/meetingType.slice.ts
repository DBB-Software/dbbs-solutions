import { ListPayload, ListResponse, MeetingType, UpdatePayload } from '../../../types'
import { buildQueryParams } from '../../../utils'
import { apiSlice, ApiSliceTag } from '../apiSlice'

export const MEETING_TYPE_URL_SEGMENTS = {
  MEETING_TYPES: 'meeting-types'
}

export const buildMeetingTypesPath = () => `/${MEETING_TYPE_URL_SEGMENTS.MEETING_TYPES}`
export const buildMeetingTypesIdPath = (id: string) => `/${MEETING_TYPE_URL_SEGMENTS.MEETING_TYPES}/${id}`

export const meetingTypeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMeetingType: builder.mutation<MeetingType, Partial<MeetingType>>({
      query: (body) => ({
        url: buildMeetingTypesPath(),
        method: 'POST',
        body
      }),
      invalidatesTags: [ApiSliceTag.MeetingType]
    }),
    updateMeetingType: builder.mutation<MeetingType, UpdatePayload<MeetingType>>({
      query: ({ id, item }) => ({
        url: buildMeetingTypesIdPath(id),
        method: 'PATCH',
        body: item
      }),
      invalidatesTags: [ApiSliceTag.MeetingType]
    }),
    deleteMeetingType: builder.mutation<void, string>({
      query: (meetingTypeId) => ({
        url: buildMeetingTypesIdPath(meetingTypeId),
        method: 'DELETE'
      }),
      invalidatesTags: [ApiSliceTag.MeetingType]
    }),
    getMeetingTypeList: builder.query<ListResponse<MeetingType>, ListPayload>({
      query: (query) => {
        const params = buildQueryParams(query)

        return {
          url: `${buildMeetingTypesPath()}?${params.toString()}`,
          method: 'GET'
        }
      },
      providesTags: [ApiSliceTag.MeetingType]
    })
  })
})

export const selectDomainGetMeetingTypeList = meetingTypeSlice.endpoints.getMeetingTypeList.select

export const {
  useGetMeetingTypeListQuery,
  useCreateMeetingTypeMutation,
  useUpdateMeetingTypeMutation,
  useDeleteMeetingTypeMutation
} = meetingTypeSlice
