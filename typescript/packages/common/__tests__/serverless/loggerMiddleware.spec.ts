import { pino } from 'pino'
import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda'
import { loggerMiddleware } from '../../src/serverless/loggerMiddleware.js'
import { ICustomContext } from '../../src/serverless/types/loggerMiddleware.js'

const mockedLambdaRequestTracker = jest.fn()

jest.mock('pino', () => ({
  pino: jest.fn().mockImplementation(() => ({
    error: jest.fn()
  }))
}))

jest.mock('pino-lambda', () => ({
  lambdaRequestTracker: jest.fn().mockImplementation(() => mockedLambdaRequestTracker),
  pinoLambdaDestination: jest.fn()
}))

describe('loggerMiddleware', () => {
  const mockedInitOptions: object = { name: 'test' }

  beforeEach(jest.clearAllMocks)

  describe('init', () => {
    test.each([
      {
        description: 'should init pino logger with destination, request tracker and defined options',
        input: mockedInitOptions,
        expectedInput: [mockedInitOptions, undefined]
      },
      {
        description: 'should init pino logger with destination, request tracker and default options',
        expectedInput: [{}, undefined]
      }
    ])('$description', async ({ input, expectedInput }) => {
      const middleware = loggerMiddleware(input)

      expect(middleware).toBeDefined()
      expect(middleware).toHaveProperty('before')
      expect(middleware).toHaveProperty('onError')
      expect(pinoLambdaDestination).toHaveBeenCalled()
      expect(lambdaRequestTracker).toHaveBeenCalled()
      expect(pino).toHaveBeenCalledWith(...expectedInput)
    })
  })

  describe('loggerMiddlewareBefore', () => {
    test.each([
      {
        description: 'should assign a logger to the middleware context and invoke request tracker',
        input: { event: null, context: {} as ICustomContext }
      }
    ])('$description', async ({ input }) => {
      const middleware: any = loggerMiddleware()
      await middleware.before(input)

      expect(input.context.logger).toBeDefined()
      expect(mockedLambdaRequestTracker).toHaveBeenCalledWith(input.event, input.context)
    })
  })

  describe('loggerMiddlewareOnError', () => {
    test.each([
      {
        description: 'should log given error ',
        input: { error: new Error('Test error message'), event: {}, context: {} } as any,
        expectedCallTimes: 1
      },
      {
        description: 'should not log without providing error',
        input: { error: null, event: {}, context: {} } as any,
        expectedCallTimes: 0
      }
    ])('$description', async ({ input, expectedCallTimes }) => {
      const middleware: any = loggerMiddleware()
      await middleware.before({ event: input.event, context: input.context })
      await middleware.onError({ error: input.error, context: input.context })

      expect(input.context.logger.error).toBeCalledTimes(expectedCallTimes)
    })
  })
})
