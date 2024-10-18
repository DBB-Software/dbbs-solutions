import { Context } from 'aws-lambda'
import { Logger } from 'pino'
import { LambdaEvent } from 'pino-lambda'

/**
 * Custom context interface extending AWS Lambda context with a logger.
 * This interface includes a logger instance and AWS request ID.
 * @interface
 * @extends {Context}
 */
export interface ICustomContext extends Context {
  /** The logger instance for logging within the Lambda function. */
  logger: Logger<never>
  /** The unique ID assigned to the AWS Lambda request. */
  awsRequestId: string
}

/**
 * Input parameters interface for the logger middleware before hook.
 * @interface
 */
export interface ILoggerMiddlewareBeforeInput {
  /** The event object received by the Lambda function. */
  event: LambdaEvent
  /** The custom context including the logger for the Lambda function. */
  context: ICustomContext
}

/**
 * Input parameters interface for the logger middleware onError hook.
 * @interface
 */
export interface ILoggerMiddlewareOnErrorInput {
  /** The error object captured during the Lambda function execution. */
  error: Error | null
  /** The custom context including the logger for the Lambda function. */
  context: ICustomContext
}
