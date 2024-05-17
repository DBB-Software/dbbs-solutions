import { Logger } from '@dbbs/nestjs-module-logger'
import { ExampleService } from './example.service.js'

describe('ExampleService', () => {
  describe('getExample', () => {
    const logger = new Logger({})
    const exampleService = new ExampleService(logger)

    const testCases = [
      {
        description: 'should receive an example',
        id: 'valid ID',
      }
    ]

    test.each(testCases)('$description', async ({ id }) => {
      expect(exampleService.getExample(id).id).toEqual(id)
    })
  })
})
