import { Logger } from '@dbbs/nestjs-module-logger'
import { ConfigService } from '@nestjs/config'
import { ExampleService } from './example.service.js'

describe('ExampleService', () => {
  describe('getExample', () => {
    const configService = new ConfigService({ DBB_WATERMARK: 'DBBs watermark' })
    const logger = new Logger({})
    const exampleService = new ExampleService(configService, logger)

    const testCases = [
      {
        description: 'should receive an example',
        id: 'valid ID',

        expectedResult: { id: 'valid ID', watermark: 'DBBs watermark' }
      }
    ]

    test.each(testCases)('$description', async ({ id, expectedResult }) => {
      expect(exampleService.getExample(id)).toEqual(expectedResult)
    })
  })
})
