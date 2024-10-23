import { LambdaClient, LogType } from '@aws-sdk/client-lambda'
import { fromUtf8 } from '@aws-sdk/util-utf8-node'
import { SettingServiceClient } from '../../src/domain/setting-service-client'

describe('SettingServiceClient', () => {
  const correctSettingsContent = {
    TENANTS: { 'dbbs-uk': { NAME: 'dbbs-uk' } }
  }
  const mockedFunctionName: string = 'getSettingsLambda'
  const mockedRegion: string = 'eu-central-1'
  const mockedEnableXRay: boolean = false
  const mockedEndpoint: string = 'http://localhost:3000'
  const mockedTenantId: string = 'dbbs-uk'
  let lambdaClientMock: LambdaClient

  beforeEach(() => {
    lambdaClientMock = new LambdaClient()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create cache object and init lambda client', () => {
      const input = { region: mockedRegion, endpoint: mockedEndpoint, settingsFunctionName: mockedFunctionName }

      const settingServiceClient = new SettingServiceClient(input)

      expect(settingServiceClient.lambdaClient).toBeDefined()
      expect(settingServiceClient.cache).toBeDefined()
      expect(settingServiceClient.settingsFunctionName).toBe(input.settingsFunctionName)
    })

    test.each([
      {
        description: 'should throw not defined region error ',
        input: {
          region: undefined as any,
          endpoint: mockedEndpoint,
          settingsFunctionName: mockedFunctionName,
          enableXRay: mockedEnableXRay
        },
        expectedError: 'region is not defined'
      },
      {
        description: 'should throw not defined endpoint error ',
        input: {
          region: mockedRegion,
          endpoint: undefined as any,
          settingsFunctionName: mockedFunctionName,
          enableXRay: mockedEnableXRay
        },
        expectedError: 'endpoint is not defined'
      },
      {
        description: 'should throw not defined settingsFunctionName error ',
        input: {
          region: mockedRegion,
          endpoint: mockedEndpoint,
          settingsFunctionName: undefined as any,
          enableXRay: mockedEnableXRay
        },
        expectedError: 'settingsFunctionName is not defined'
      }
    ])('$description', async ({ input, expectedError }) => {
      expect(() => new SettingServiceClient(input)).toThrowError(expectedError)
    })
  })

  describe('getAllTenantSettings', () => {
    it('should call getTenantSettings func with expected input', async () => {
      const input = { region: mockedRegion, endpoint: mockedEndpoint, settingsFunctionName: mockedFunctionName }
      const settingServiceClient = new SettingServiceClient(input)

      jest.spyOn(settingServiceClient, 'getSettings').mockResolvedValue({})

      await settingServiceClient.getAllTenantSettings()
    })
  })

  describe('getTenantSettings', () => {
    it('should call getSettings func with without input params', async () => {
      const input = {
        region: mockedRegion,
        endpoint: mockedEndpoint,
        settingsFunctionName: mockedFunctionName,
        tenantId: mockedTenantId
      }
      const expectedInput = mockedTenantId

      const settingServiceClient = new SettingServiceClient(input)

      jest.spyOn(settingServiceClient, 'getSettings').mockResolvedValue({})

      await settingServiceClient.getTenantSettings(input.tenantId)

      expect(settingServiceClient.getSettings).toHaveBeenCalledWith(expectedInput)
    })
  })

  describe('getSettings', () => {
    test.each([
      {
        description:
          'should call lambdaClient send command with correct input, return tenant settings from send command or cache',
        input: {
          region: mockedRegion,
          endpoint: mockedEndpoint,
          settingsFunctionName: mockedFunctionName,
          tenantId: mockedTenantId
        },
        expectedReturn: correctSettingsContent,
        expectedSendReturn: { Payload: fromUtf8(JSON.stringify(correctSettingsContent)) } as never,
        expectedInput: {
          FunctionName: mockedFunctionName,
          LogType: LogType.Tail,
          Payload: fromUtf8(JSON.stringify({ tenantId: mockedTenantId }))
        },
        expectedCallTimes: 1
      },
      {
        description: 'should call lambdaClient send command with wrong input params',
        input: {
          region: mockedRegion,
          endpoint: mockedEndpoint,
          settingsFunctionName: mockedFunctionName,
          tenantId: null as any
        },
        expectedReturn: correctSettingsContent,
        expectedSendReturn: { Payload: fromUtf8(JSON.stringify(correctSettingsContent)) } as never,
        expectedInput: {
          FunctionName: mockedFunctionName,
          LogType: LogType.Tail,
          Payload: fromUtf8(JSON.stringify({ tenantId: null as any }))
        },
        expectedCallTimes: 1
      }
    ])('$description', async ({ input, expectedSendReturn, expectedInput, expectedReturn, expectedCallTimes }) => {
      const settingServiceClient = new SettingServiceClient(input)
      jest.spyOn(settingServiceClient.lambdaClient, 'send').mockResolvedValue(expectedSendReturn)
      const result = await settingServiceClient.getSettings(input.tenantId)

      expect(result).toStrictEqual(expectedReturn)
      expect(settingServiceClient.lambdaClient.send).toHaveBeenCalledWith(
        expect.objectContaining({ input: expectedInput })
      )

      const cachedResult = await settingServiceClient.getSettings(input.tenantId)

      expect(cachedResult).toStrictEqual(expectedReturn)
      expect(settingServiceClient.lambdaClient.send).toBeCalledTimes(expectedCallTimes)
    })
  })
})
