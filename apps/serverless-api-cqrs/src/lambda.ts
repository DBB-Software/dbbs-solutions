import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpSecurityHeaders from '@middy/http-security-headers'
import inputOutputLogger from '@middy/input-output-logger'
import { configure as serverlessExpress } from '@vendia/serverless-express'
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import ow from 'ow'
import { asyncContextStorage } from './asyncContextStorage.js'
import { initNestApp } from './nestApp.js'

let serverlessExpressInstance: Handler

/**
 * Bootstraps the NestJS server within a serverless environment.
 *
 * @param {APIGatewayEvent} event - The API Gateway event.
 * @param {Context} context - The AWS Lambda context.
 * @returns {Promise<Handler>} The serverless handler.
 *
 * This function initializes the NestJS application and configures it to run in a serverless environment,
 * using AWS Lambda and API Gateway.
 */
async function bootstrapNestServer(event: APIGatewayEvent, context: Context): Promise<Handler> {
  asyncContextStorage.enterWith({ context, event })

  if (serverlessExpressInstance) {
    return serverlessExpressInstance
  }

  const nestApp = await initNestApp()

  serverlessExpressInstance = serverlessExpress({
    app: nestApp.getHttpAdapter().getInstance()
  })

  return serverlessExpressInstance
}

/**
 * Starts the serverless application.
 *
 * Initializes and starts the serverless NestJS application.
 *
 * @param {APIGatewayEvent} event - The API Gateway event.
 * @param {Context} context - The AWS Lambda context.
 * @param {Callback} callback - The AWS Lambda callback.
 * @returns {Promise<Handler>} The serverless handler.
 */
export async function startServer(event: APIGatewayEvent, context: Context, callback: Callback): Promise<Handler> {
  const server = await bootstrapNestServer(event, context)

  return server(event, context, callback)
}

ow(process.env.REGION, ow.string.not.empty)

/**
 * Middleware-enhanced serverless handler.
 *
 * Applies middlewares for handling empty event loop, HTTP security headers, and input-output logging.
 */
export const bootstrapNestServerHandler = middy(startServer)
bootstrapNestServerHandler.use(doNotWaitForEmptyEventLoop({ runOnError: true }))
bootstrapNestServerHandler.use(httpSecurityHeaders())
bootstrapNestServerHandler.use(
  inputOutputLogger({
    logger: (request: { event: string; response: string }) => {
      // TODO: setup proper log level for production
      if (process.env.NODE_ENV !== 'production') {
        console.debug(JSON.stringify(request.event ?? request.response))
      }
    },
    awsContext: true
  })
)
