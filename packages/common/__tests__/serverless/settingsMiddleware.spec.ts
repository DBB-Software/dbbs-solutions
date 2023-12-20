import { LambdaClient } from '@aws-sdk/client-lambda'
import AWSXRayCore from 'aws-xray-sdk-core'
import { SettingServiceClient } from '../../src/domain/setting-service-client.js'
import { settingsMiddleware } from '../../src/serverless/settingsMiddleware.js'
import { ICustomSettingsContext } from '../../src/serverless/types/settingsMiddleware.js'

jest.mock('@aws-sdk/client-lambda', () => ({
  LambdaClient: jest.fn()
}))

jest.mock('aws-xray-sdk-core', () => ({
  captureAWSv3Client: jest.fn()
}))

jest.mock('../../src/domain/setting-service-client.ts', () => ({
  SettingServiceClient: jest.fn()
}))

describe('settingsMiddleware', () => {
  const mockedRegion: string = 'eu-central-1'
  const mockedEndpoint: string = 'http://localhost:3032'
  const mockedServiceName: string = 'test-service-name'

  beforeEach(jest.clearAllMocks)

  describe('init', () => {
    test.each([
      {
        description: 'should init settingsService with correct input params but without XRay',
        input: {
          region: mockedRegion,
          endpoint: mockedEndpoint,
          serviceName: mockedServiceName
        },
        expectedCallTimes: 0,
        expectedClientInput: {
          region: mockedRegion,
          endpoint: mockedEndpoint
        }
      },
      {
        description: 'should init settingsService with correct input params and invoking captureAWSv3Client',
        input: {
          region: mockedRegion,
          endpoint: mockedEndpoint,
          serviceName: mockedServiceName,
          enableXRay: true
        },
        expectedCallTimes: 1,
        expectedClientInput: {
          region: mockedRegion,
          endpoint: mockedEndpoint
        }
      },
      {
        description: 'should init settingsService with wrong input params',
        input: {
          region: null as any,
          endpoint: null as any,
          serviceName: null as any
        },
        expectedCallTimes: 0,
        expectedClientInput: {
          region: null as any,
          endpoint: null as any
        }
      }
    ])('$description', async ({ input, expectedClientInput, expectedCallTimes }) => {
      const middleware = settingsMiddleware(input)

      expect(LambdaClient).toHaveBeenCalledWith(expectedClientInput)
      expect(AWSXRayCore.captureAWSv3Client).toHaveBeenCalledTimes(expectedCallTimes)
      expect(SettingServiceClient).toHaveBeenCalled()
      expect(middleware).toHaveProperty('before')
    })
  })

  describe('settingsMiddlewareBefore', () => {
    it('should assign a settingServiceClient to the middleware context', async () => {
      const input = {
        region: mockedRegion,
        endpoint: mockedEndpoint,
        serviceName: mockedServiceName,
        context: {} as ICustomSettingsContext
      }

      const middleware: any = settingsMiddleware(input)
      await middleware.before(input)

      expect(input.context.settingsService).toBeDefined()
    })
  })
})
