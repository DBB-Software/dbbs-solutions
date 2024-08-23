import { AuthzModule } from '@dbbs/nestjs-module-authz'
import { HealthModule } from '@dbbs/nestjs-module-health'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { DatabaseModule } from '@dbbs/nestjs-module-database'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SettingsModule } from '@dbbs/nestjs-module-settings'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { ExampleModule } from './example-module/example.module.js'
import { StripePaymentModule } from './stripe-payment/stripe-payment.module.js'
import { loggerOptions } from './logger.config.js'
import { REGION, SETTINGS_SERVICE_ENABLE_XRAY, SETTINGS_SERVICE_ENDPOINT, SETTINGS_SERVICE_NAME } from './constants.js'

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
    HealthModule,
    AuthzModule,
    ExampleModule,
    StripePaymentModule,
    DatabaseModule.forRoot({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './data.db'
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
