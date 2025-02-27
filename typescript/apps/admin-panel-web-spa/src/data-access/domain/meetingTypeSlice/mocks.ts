import { ListResponse, MeetingType, UpdatePayload } from '../../../types'

export const mockMeetingType: MeetingType = {
  id: '1696363998091x841233251333633000',
  modifiedDate: '2023-11-09T18:50:52.743000Z',
  createdDate: '2023-10-03T20:13:18.096000Z',
  createdBy: 'admin_user_meta_live',
  title: 'Wynwood Design Review Committee',
  sortkey: 'Miami1Wynwood Design Review Committee',
  geo: '1686087434936x926623722684097400',
  geoParent: '1686087434934x882269048954331000',
  geoParent2: '1698294322096x146294304468672640'
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
