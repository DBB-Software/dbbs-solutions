import { Global, Module, DynamicModule } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import * as Sentry from '@sentry/node'
import { SentryGlobalFilter } from '@sentry/nestjs/setup'
import { Logger } from '@dbbs/nestjs-module-logger'

export interface ISentryModuleOptions extends Sentry.NodeOptions {}

const SENTRY_PROVIDER = 'SENTRY_PROVIDER'

@Global()
@Module({})
export class SentryModule {
  static forRoot(options: ISentryModuleOptions = {}): DynamicModule {
    const { dsn = process.env.SENTRY_DSN } = options

    return {
      module: SentryModule,
      imports: [],
      providers: [
        {
          provide: APP_FILTER,
          useClass: SentryGlobalFilter
        },
        {
          provide: SENTRY_PROVIDER,
          useFactory: async (logger: Logger) => {
            if (!dsn) {
              logger.warn('Sentry DSN is not provided')
            }

            return Sentry.init({ ...options, dsn })
          },
          inject: [Logger]
        }
      ],
      exports: [SentryModule]
    }
  }
}
