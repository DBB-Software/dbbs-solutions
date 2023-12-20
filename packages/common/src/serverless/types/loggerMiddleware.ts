import { Context } from 'aws-lambda'
import { Logger } from 'pino'
import { LambdaEvent } from 'pino-lambda'

export interface ILogger extends Logger {}

export interface ICustomContext extends Context {
  logger: ILogger
  awsRequestId: string
}

export interface ILoggerMiddlewareBeforeInput {
  event: LambdaEvent

  context: ICustomContext
}

export interface ILoggerMiddlewareOnErrorInput {
  error: Error | null

  context: ICustomContext
}
