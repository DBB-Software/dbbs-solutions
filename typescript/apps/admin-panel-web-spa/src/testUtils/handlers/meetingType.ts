import { http, HttpResponse } from 'msw'
import {
  mockMeetingType,
  mockMeetingTypeListResponse,
  buildMeetingTypesIdPath,
  buildMeetingTypesPath
} from '../../data-access'

const responseOptions = {
  headers: {
    'Content-Type': 'application/json'
  },
  status: 200
}

export const meetingTypeHandlers = [
  http.get(
    new RegExp(`${buildMeetingTypesPath()}(?!/)`),
    () => new HttpResponse(JSON.stringify(mockMeetingTypeListResponse), responseOptions)
  ),

  http.post(
    new RegExp(buildMeetingTypesPath()),
    () => new HttpResponse(JSON.stringify(mockMeetingType), responseOptions)
  ),

  http.put(
    new RegExp(buildMeetingTypesIdPath('\\s+')),
    () => new HttpResponse(JSON.stringify(mockMeetingType), responseOptions)
  ),

  http.delete(
    new RegExp(buildMeetingTypesIdPath('\\s+')),
    () => new HttpResponse(JSON.stringify({ success: true }), responseOptions)
  )
]
