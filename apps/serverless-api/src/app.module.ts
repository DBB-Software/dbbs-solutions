import { AuthzModule } from '@dbbs/nestjs-module-authz'
import { HealthModule } from '@dbbs/nestjs-module-health'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClsModule } from 'nestjs-cls'
import { ExampleModule } from './example-module/example.module.js'
import { loggerOptions } from './logger.config.js'
import { asyncContextStorage } from './asyncContextStorage.js'
import { CLS_STORAGE_NAME } from './constants.js'
import { SettingsModule } from './settings/settings.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(loggerOptions),
    AuthzModule,
    ExampleModule,
    HealthModule,
    SettingsModule,
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
