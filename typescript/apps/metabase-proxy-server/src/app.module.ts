import { AuthzModule } from '@dbbs/nestjs-module-authz'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { APP_FILTER, Reflector } from '@nestjs/core'
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup'
import { CacheModule, CacheManager } from '@dbbs/nestjs-module-cache-manager'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { DatabaseModule } from './database/database.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CacheModule,
    SentryModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthzModule,
    LoggerModule.forRoot({})
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter
    },
    CacheManager,
    Reflector
  ]
})
export class AppModule {}
