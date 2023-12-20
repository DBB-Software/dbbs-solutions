import middy, { MiddlewareObj } from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { pino } from 'pino'
import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda'
import {
  ICustomContext,
  ILoggerMiddlewareBeforeInput,
  ILoggerMiddlewareOnErrorInput
} from './types/loggerMiddleware.js'

export function loggerMiddleware(
  options: object = {}
): MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, ICustomContext> {
  const destination = pinoLambdaDestination()

  const logger = pino(options, destination)

  // custom destination formatter
  const withRequest = lambdaRequestTracker()

  const loggerMiddlewareBefore: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Error,
    ICustomContext
  > = async (request: ILoggerMiddlewareBeforeInput): Promise<void> => {
    const { event, context } = request

    withRequest(event, context)

    context.logger = logger
  }

  const loggerMiddlewareOnError: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Error,
    ICustomContext
  > = async (request: ILoggerMiddlewareOnErrorInput): Promise<void> => {
    const { error, context } = request

    if (!error) {
      return
    }

    context.logger.error({ error }, error.message)
  }

  return {
    before: loggerMiddlewareBefore,
    onError: loggerMiddlewareOnError
  }
}
