import { DynamicModule, Global, Module } from '@nestjs/common'
import { AsyncLocalStorage } from 'async_hooks'
import { APIGatewayEvent, Context } from 'aws-lambda'
import { IncomingMessage } from 'http'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { Options as PinoHttpOptions } from 'pino-http'
import { createProvidersForDecorated } from './injectLogger.js'
import { Logger } from './logger.js'
import { lambdaRequestTracker, serverRequestTracker } from './requestTrackers.js'

@Global()
@Module({ providers: [Logger], exports: [Logger] })
export class LoggerModule {
  static forRoot(pinoHttpOpts?: PinoHttpOptions, asyncContext?: AsyncLocalStorage<unknown>): DynamicModule {
    const decorated = createProvidersForDecorated()
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRoot({
          pinoHttp: {
            redact: ['req', 'res'],
            ...pinoHttpOpts,
            customProps: (req: IncomingMessage) => {
              const lambdaParams = asyncContext?.getStore()
              if (lambdaParams)
                return lambdaRequestTracker(asyncContext?.getStore() as { event: APIGatewayEvent; context: Context })
              return serverRequestTracker(req)
            }
          }
        })
      ],
      providers: [...decorated, Logger],
      exports: [...decorated, Logger]
    }
  }
}
