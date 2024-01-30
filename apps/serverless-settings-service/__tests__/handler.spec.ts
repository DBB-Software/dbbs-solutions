import { getSettings } from '../src/handler.js'
import { ICustomContext } from '@dbbs/common'

const correctSettingsContent = {
  TENANTS: { 'dbbs-us': { NAME: 'dbbs-us' }, 'dbbs-cn': { NAME: 'dbbs-cn' } }
}

jest.mock('@dbbs/common', () => ({
  loggerMiddleware: jest.fn().mockImplementation(() => ({
    before: jest.fn(),
    middleware: jest.fn()
  })),
  CustomS3Handler: jest.fn().mockImplementation(() => ({
    downloadJSONfromS3: jest.fn().mockReturnValue(correctSettingsContent)
  }))
}))

describe('getSettingsHandler', () => {
  const mockedRegion = 'eu-central-1'
  const mockedBucket = 'test-bucket'
  const mockedFile = 'test-file'
  const mockedWrongTenantId = 'wrong-tenant'

  function clearEnvVariable(variable: string = '') {
    process.env[variable] = ''
  }

  describe('getSettings', () => {
    beforeEach(() => {
      process.env.SETTINGS_BUCKET = mockedBucket
      process.env.SETTINGS_FILE = mockedFile
      process.env.REGION = mockedRegion
    })

    test.each([
      {
        description: 'should return all settings without tenantId',
        input: { event: {}, context: { logger: console } },
        expectedResult: correctSettingsContent
      },
      {
        description: 'should return settings by tenantId',
        input: { event: { tenantId: 'dbbs-us' }, context: { logger: console } },
        expectedResult: correctSettingsContent.TENANTS['dbbs-us']
      }
    ])('$description', async ({ input, expectedResult }) => {
      const { event, context } = input
      const result = await getSettings(event, context as unknown as ICustomContext)

      expect(result).toEqual(expectedResult)
    })

    test.each([
      {
        description: 'should throw not valid tenantId',
        input: { event: { tenantId: mockedWrongTenantId }, context: { logger: console } },
        expectedErrorMessage: `Tenant ${mockedWrongTenantId} does not exists in settings`
      },
      {
        description: 'should throw not specified REGION',
        input: { event: {}, context: { logger: console } },
        envToClear: 'REGION',
        expectedErrorMessage: `No REGION variable provided`
      },
      {
        description: 'should throw not specified SETTINGS_BUCKET',
        input: { event: {}, context: { logger: console } },
        envToClear: 'SETTINGS_BUCKET',
        expectedErrorMessage: `No SETTINGS_BUCKET variable provided`
      },
      {
        description: 'should throw not specified SETTINGS_FILE',
        input: { event: {}, context: { logger: console } },
        envToClear: 'SETTINGS_FILE',
        expectedErrorMessage: `No SETTINGS_FILE variable provided`
      }
    ])('$description', async ({ input, expectedErrorMessage, envToClear }) => {
      const { event, context } = input
      clearEnvVariable(envToClear)

      await expect(async () => await getSettings(event, context as unknown as ICustomContext)).rejects.toThrow(expectedErrorMessage)
    })
  })
})
