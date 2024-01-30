import { AuthzModule } from '@dbbs/nestjs-module-authz'
import { HealthModule } from '@dbbs/nestjs-module-health'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ExampleModule } from './example-module/example.module.js'
import { loggerOptions } from './logger.config.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(loggerOptions),
    AuthzModule,
    ExampleModule,
    HealthModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log(consumer)
  }
}
