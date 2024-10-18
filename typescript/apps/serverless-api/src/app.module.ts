import { AuthzModule } from '@dbbs/nestjs-module-authz'
import { HealthModule } from '@dbbs/nestjs-module-health'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { SettingsModule } from '@dbbs/nestjs-module-settings'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClsModule } from 'nestjs-cls'
import { ExampleModule } from './example-module/example.module.js'
import { loggerOptions } from './logger.config.js'
import { asyncContextStorage } from './asyncContextStorage.js'
import {
  CLS_STORAGE_NAME,
  REGION,
  SETTINGS_SERVICE_ENDPOINT,
  SETTINGS_SERVICE_NAME,
  SETTINGS_SERVICE_ENABLE_XRAY
} from './constants.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(loggerOptions),
    SettingsModule.forRoot({
      region: REGION,
      endpoint: SETTINGS_SERVICE_ENDPOINT,
      serviceName: SETTINGS_SERVICE_NAME,
      enableXRay: SETTINGS_SERVICE_ENABLE_XRAY
    }),
    AuthzModule,
    ExampleModule,
    HealthModule,
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls) => {
          cls.set(CLS_STORAGE_NAME, asyncContextStorage.getStore())
        }
      }
    })
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log(consumer)
  }
}
