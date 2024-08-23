/**
 * Module representing the bootstrap and start server functionality.
 * @module ServerBootstrap
 */

import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpSecurityHeaders from '@middy/http-security-headers'
import inputOutputLogger from '@middy/input-output-logger'
import { configure as serverlessExpress } from '@vendia/serverless-express'
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import ow from 'ow'
import { asyncContextStorage } from './asyncContextStorage.js'
import { initNestApp } from './nestApp.js'

/**
 * Represents the serverless express instance handler.
 * @type {Handler}
 */
let serverlessExpressInstance: Handler

/**
 * Bootstraps the Nest.js server.
 * @param {APIGatewayEvent} event - The AWS API Gateway event.
 * @param {Context} context - The AWS Lambda context.
 * @returns {Promise<Handler>} The serverless express instance handler.
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
 * Starts express serverless instance.
 * @param {APIGatewayEvent} event - The AWS API Gateway event.
 * @param {Context} context - The AWS Lambda context.
 * @param {Callback} callback - The AWS Lambda callback function.
 * @returns {Promise<Handler>} The serverless express instance handler.
 */
export async function startServer(event: APIGatewayEvent, context: Context, callback: Callback): Promise<Handler> {
  const server = await bootstrapNestServer(event, context)

  return server(event, context, callback)
}

ow(process.env.REGION, ow.string.not.empty)

/**
 * Middy middleware for handling server bootstrap.
 * @type {middy.MiddlewareObj}
 */
export const bootstrapNestServerHandler = middy(startServer)

bootstrapNestServerHandler.use(doNotWaitForEmptyEventLoop({ runOnError: true }))
bootstrapNestServerHandler.use(httpSecurityHeaders())

/**
 * Middleware for logging input and output.
 */
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
