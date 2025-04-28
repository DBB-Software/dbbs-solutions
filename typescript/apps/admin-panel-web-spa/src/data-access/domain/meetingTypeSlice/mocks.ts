import { ListResponse, MeetingType, UpdatePayload } from '../../../types'

export const mockMeetingType: MeetingType = {
  id: '1696363998091x841233251333633000',
  name: 'Wynwood Design Review Committee',
  createdAt: '2021-07-29T17:17:25.000Z',
  updatedAt: '2021-07-29T17:17:25.000Z'
}

export const mockMeetingTypeListResponse: ListResponse<MeetingType> = {
  count: 10,
  cursor: 0,
  remaining: 90,
  results: [mockMeetingType]
}

export const mockUpdateMeetingTypePayload: UpdatePayload<MeetingType> = {
  id: mockMeetingType.id,
  item: mockMeetingType
}
