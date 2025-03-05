import { http, HttpResponse } from 'msw'
import { mockGeo, mockGeoListResponse, buildGeosIdPath, buildGeosPath } from '../../data-access'

const responseOptions = {
  headers: {
    'Content-Type': 'application/json'
  },
  status: 200
}

export const geoHandlers = [
  http.get(
    new RegExp(`${buildGeosPath()}(?!/)`),
    () => new HttpResponse(JSON.stringify(mockGeoListResponse), responseOptions)
  ),

  http.post(new RegExp(buildGeosPath()), () => new HttpResponse(JSON.stringify(mockGeo), responseOptions)),

  http.put(new RegExp(buildGeosIdPath('\\s+')), () => new HttpResponse(JSON.stringify(mockGeo), responseOptions)),

  http.delete(
    new RegExp(buildGeosIdPath('\\s+')),
    () => new HttpResponse(JSON.stringify({ success: true }), responseOptions)
  )
]
