import { AuthzModule } from '@dbbs/nestjs-module-authz'
import { HealthModule } from '@dbbs/nestjs-module-health'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { ExampleModule } from './example-module/example.module.js'
import { loggerOptions } from './logger.config.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(loggerOptions),
    HealthModule,
    AuthzModule,
    ExampleModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
