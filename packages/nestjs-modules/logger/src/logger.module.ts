import { DynamicModule, Global, Module } from '@nestjs/common'
import { AsyncLocalStorage } from 'async_hooks'
import { APIGatewayEvent, Context } from 'aws-lambda'
import { IncomingMessage } from 'http'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { Params } from 'nestjs-pino/params.js'
import { createProvidersForDecorated } from './injectLogger.js'
import { Logger } from './logger.js'
import { lambdaRequestTracker, serverRequestTracker } from './requestTrackers.js'

export interface ILoggerOptions extends Params {
  asyncContext?: AsyncLocalStorage<unknown>
}

@Global()
@Module({ providers: [Logger], exports: [Logger] })
export class LoggerModule {
  static forRoot(opts: ILoggerOptions): DynamicModule {
    const { pinoHttp: pinoHttpOptions, asyncContext } = opts
    const decorated = createProvidersForDecorated()

    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRoot({
          ...opts,
          pinoHttp: {
            redact: ['req', 'res'],
            customProps: (req: IncomingMessage) => {
              const lambdaParams = asyncContext?.getStore()
              if (lambdaParams)
                return lambdaRequestTracker(
                  asyncContext?.getStore() as {
                    event: APIGatewayEvent
                    context: Context
                  }
                )
              return serverRequestTracker(req)
            },
            ...pinoHttpOptions
          }
        })
      ],
      providers: [...decorated, Logger],
      exports: [...decorated, Logger]
    }
  }
}
