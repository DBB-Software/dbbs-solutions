import { of, throwError } from 'rxjs'
import { HttpService } from '@nestjs/axios'

export const mockConfigService = {
  get: jest.fn((key: string) => {
    switch (key) {
      case 'STRAPI_BASE_URL':
        return 'http://localhost:1337'
      case 'STRAPI_AUTH_TOKEN':
        return 'test-token'
      default:
        return null
    }
  })
}

export const mockHttpServiceGet = (httpService: HttpService, responses: unknown[]) => {
  responses.forEach((response) => {
    if (response instanceof Error) {
      jest.spyOn(httpService, 'get').mockReturnValueOnce(throwError(() => response))
    } else {
      // eslint-disable-next-line
      jest.spyOn(httpService, 'get').mockReturnValueOnce(of({ data: response } as any))
    }
  })
}
