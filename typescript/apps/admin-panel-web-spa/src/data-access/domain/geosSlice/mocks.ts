import { Geo, ListResponse, UpdatePayload } from '../../../types'

export const mockGeo: Geo = {
  id: '1',
  modifiedDate: '2024-09-16T07:48:00.295Z',
  createdDate: '2024-09-09T17:25:51.788Z',
  createdBy: 'admin_user_tutorial-99246_test',
  name: 'Onslow County School Board',
  scheduleUrl: 'https://go.boarddocs.com/nc/onslow/Board.nsf/public',
  geoType: 'School board',
  timezone: 'America/New_York',
  captureScheduleFlag: true,
  captureStreamFlag: false,
  scheduleFormat: 'boarddocs_table',
  streamType: 'ts_youtube',
  jurisdiction: true,
  parent: {
    id: '1',
    name: 'Geo',
    fullName: 'Geo (Other) in The Universe'
  },

  channelUrl: 'https://www.youtube.com/@OCSMultimedia/streams',
  statusSchedule: 'Updating',
  bubbleId: '213',
  detectStartMethod: 'youtube',
  detectEndMethod: 'youtube'
}

export const getMockGeoList = (totalCount: number): Geo[] =>
  Array.from(Array(totalCount)).map((_, index) => ({
    ...mockGeo,
    id: String(index + 1)
  }))

export const mockGeoListResponse: ListResponse<Geo> = {
  count: 10,
  cursor: 0,
  remaining: 90,
  results: [mockGeo]
}

export const mockUpdateGeoPayload: UpdatePayload<Geo> = {
  id: mockGeo.id,
  item: mockGeo
}

export const mockGeoTypes = ['Type 1', 'Type 2', 'Type 3']
