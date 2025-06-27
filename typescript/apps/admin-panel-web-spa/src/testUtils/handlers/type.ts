import { http, HttpResponse } from 'msw'
import { mockType, mockTypeListResponse, buildTypesIdPath, buildTypesPath } from '../../data-access'

const responseOptions = {
  headers: {
    'Content-Type': 'application/json'
  },
  status: 200
}

export const typeHandlers = [
  http.get(
    new RegExp(`${buildTypesPath()}(?!/)`),
    () => new HttpResponse(JSON.stringify(mockTypeListResponse), responseOptions)
  ),

  http.post(new RegExp(buildTypesPath()), () => new HttpResponse(JSON.stringify(mockType), responseOptions)),

  http.put(new RegExp(buildTypesIdPath('\\s+')), () => new HttpResponse(JSON.stringify(mockType), responseOptions)),

  http.delete(
    new RegExp(buildTypesIdPath('\\s+')),
    () => new HttpResponse(JSON.stringify({ success: true }), responseOptions)
  )
]
