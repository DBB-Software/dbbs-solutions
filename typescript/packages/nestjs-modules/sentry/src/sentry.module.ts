import { Global, Module, DynamicModule } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import * as Sentry from '@sentry/node'
import { SentryGlobalFilter } from '@sentry/nestjs/setup'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Logger } from '@dbbs/nestjs-module-logger'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

export const SENTRY_PROVIDER = 'SENTRY_PROVIDER'

@Global()
@Module({})
class SentryModule {
  static forRootAsync(): DynamicModule {
    return {
      module: SentryModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: APP_FILTER,
          useClass: SentryGlobalFilter
        },
        {
          provide: SENTRY_PROVIDER,
          useFactory: async (configService: ConfigService, logger: Logger) => {
            const dsn = configService.get<string>('SENTRY_DSN')
            const environment = configService.get<string>('NODE_ENV', 'development')
            const tracesSampleRate = configService.get<number>('SENTRY_TRACES_SAMPLE_RATE', 1.0)
            const profilesSampleRate = configService.get<number>('SENTRY_PROFILES_SAMPLE_RATE', 1.0)

            if (!dsn) {
              logger.warn('Sentry DSN is not provided')
              return null
            }

            Sentry.init({
              dsn,
              environment,
              integrations: [nodeProfilingIntegration()],
              tracesSampleRate,
              profilesSampleRate
            })

            logger.info('Sentry initialized successfully')
            return Sentry
          },
          inject: [ConfigService, Logger]
        },
        {
          provide: APP_FILTER,
          useClass: SentryGlobalFilter
        }
      ],
      exports: [SENTRY_PROVIDER]
    }
  }
}

export { SentryModule }
