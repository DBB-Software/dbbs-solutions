import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { ClsModule } from 'nestjs-cls'
import { SettingsService } from './settings.service.js'
import { SettingsController } from './settings.controller.js'

@Module({
  controllers: [SettingsController],
  imports: [ConfigModule, LoggerModule, ClsModule],
  providers: [SettingsService]
})
export class SettingsModule {}
