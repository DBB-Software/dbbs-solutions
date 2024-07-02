import { Module } from '@nestjs/common'
import { HealthcheckController } from './healthcheck.controller.js'
import { HealthcheckService } from './healthcheck.service.js'

@Module({
  providers: [HealthcheckService],
  controllers: [HealthcheckController]
})
export class HealthcheckModule {}
