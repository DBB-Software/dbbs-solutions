import { LambdaClient, LogType } from '@aws-sdk/client-lambda'
import { fromUtf8 } from '@aws-sdk/util-utf8-node'
import { SettingServiceClient } from '../../src/domain/setting-service-client'

describe('SettingServiceClient', () => {
  const correctSettingsContent = {
    TENANTS: { 'dbbs-uk': { NAME: 'dbbs-uk' } }
  }
  const mockedFunctionName: string = 'getSettingsLambda'
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
      const input = { functionName: mockedFunctionName }

      const settingServiceClient = new SettingServiceClient(lambdaClientMock, input.functionName)

      expect(settingServiceClient.lambdaClient).toBeDefined()
      expect(settingServiceClient.cache).toBeDefined()
      expect(settingServiceClient.settingsFunctionName).toBe(input.functionName)
    })

    it('should throw not defined function name error ', () => {
      const input = { functionName: undefined as any }

      expect(() => new SettingServiceClient(lambdaClientMock, input.functionName)).toThrowError(
        'settingsFunctionName is not defined'
      )
    })

    it('should throw not defined lambdaClient error ', () => {
      const input = { functionName: mockedFunctionName, lambdaClient: undefined as any }

      expect(() => new SettingServiceClient(input.lambdaClient, input.functionName)).toThrowError(
        'lambdaClient is not defined'
      )
    })
  })

  describe('getAllTenantSettings', () => {
    it('should call getTenantSettings func with expected input', async () => {
      const input = { functionName: mockedFunctionName }
      const expectedInput = 'all'
      const settingServiceClient = new SettingServiceClient(lambdaClientMock, input.functionName)

      jest.spyOn(settingServiceClient, 'getSettings').mockResolvedValue({})

      await settingServiceClient.getAllTenantSettings()

      expect(settingServiceClient.getSettings).toHaveBeenCalledWith(expectedInput)
    })
  })

  describe('getTenantSettings', () => {
    it('should call getSettings func with expected input', async () => {
      const input = { functionName: mockedFunctionName, tenantId: mockedTenantId }
      const expectedInput = mockedTenantId

      const settingServiceClient = new SettingServiceClient(lambdaClientMock, input.functionName)

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
        input: { functionName: mockedFunctionName, tenantId: mockedTenantId },
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
        input: { functionName: mockedFunctionName, tenantId: null as any },
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
      const settingServiceClient = new SettingServiceClient(lambdaClientMock, input.functionName)
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
