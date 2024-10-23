import { APIGatewayEvent, Context } from 'aws-lambda'
import { IncomingMessage } from 'http'
import { v4 as uuidv4 } from 'uuid'

const AMAZON_TRACE_ID = '_X_AMZN_TRACE_ID'
const API_REQUEST_ID = 'apiRequestId'
const AWS_REQUEST_ID = 'awsRequestId'
const CORRELATION_HEADER = 'x-correlation-'
const CORRELATION_ID = `${CORRELATION_HEADER}id`
const CORRELATION_TRACE_ID = `${CORRELATION_HEADER}trace-id`

export function lambdaRequestTracker(lambdaParams: { event: APIGatewayEvent; context: Context }) {
  const { event, context } = lambdaParams

  const loggerResponse: Record<string, string | string[] | undefined> = {}

  const awsRequestId = context[AWS_REQUEST_ID]
  const apiRequestId = event.requestContext?.requestId

  if (event.headers) {
    Object.keys(event.headers).forEach((header) => {
      if (header.toLowerCase().startsWith(CORRELATION_HEADER)) {
        loggerResponse[header] = event.headers[header]
      }
    })
  }

  if (process.env[AMAZON_TRACE_ID]) {
    loggerResponse[CORRELATION_TRACE_ID] = process.env[AMAZON_TRACE_ID]
  }

  if (!loggerResponse[CORRELATION_ID]) {
    loggerResponse[CORRELATION_ID] = context.awsRequestId
  }

  loggerResponse[AWS_REQUEST_ID] = awsRequestId
  loggerResponse[API_REQUEST_ID] = apiRequestId

  return loggerResponse
}

export function serverRequestTracker(req: IncomingMessage) {
  // @ts-ignore
  if (req.allLogs) return {}

  const loggerResponse: Record<string, string | string[] | undefined> = {}

  let awsRequestId = req.headers[AWS_REQUEST_ID]
  let apiRequestId = req.headers[API_REQUEST_ID]
  let correlationId = req.headers[CORRELATION_ID]
  const correlationTraceId = req.headers[AMAZON_TRACE_ID]

  Object.keys(req.headers).forEach((header: string) => {
    if (header.toLowerCase().startsWith(CORRELATION_HEADER)) {
      loggerResponse[header] = req.headers[header]
    }
  })

  if (!apiRequestId) {
    apiRequestId = uuidv4()
    req.headers[API_REQUEST_ID] = apiRequestId
  }

  if (!awsRequestId) {
    awsRequestId = uuidv4()
    req.headers[AWS_REQUEST_ID] = awsRequestId
  }

  if (!correlationId) {
    correlationId = awsRequestId
    req.headers[CORRELATION_ID] = awsRequestId
  }

  loggerResponse[CORRELATION_TRACE_ID] = correlationTraceId
  loggerResponse[AWS_REQUEST_ID] = awsRequestId
  loggerResponse[API_REQUEST_ID] = apiRequestId
  loggerResponse[CORRELATION_ID] = correlationId

  return loggerResponse
}
