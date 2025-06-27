import { ListResponse, Type, UpdatePayload } from '../../../types'

export const mockType: Type = {
  id: '1696363998091x841233251333633000',
  name: 'Wynwood Design Review Committee',
  createdAt: '2021-07-29T17:17:25.000Z',
  updatedAt: '2021-07-29T17:17:25.000Z'
}

export const mockTypeListResponse: ListResponse<Type> = {
  count: 10,
  cursor: 0,
  remaining: 90,
  results: [mockType]
}

export const mockUpdateTypePayload: UpdatePayload<Type> = {
  id: mockType.id,
  item: mockType
}
