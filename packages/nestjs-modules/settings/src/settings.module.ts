import { DynamicModule, Module } from '@nestjs/common'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { ClsModule } from 'nestjs-cls'
import { SettingsService } from './settings.service.js'
import { SettingsController } from './settings.controller.js'
import { ISettingsModuleOptions } from './interfaces.js'
import { SETTINGS_SERVICE_PROVIDER } from './constants.js'

@Module({})
export class SettingsModule {
  static forRoot(opts: ISettingsModuleOptions): DynamicModule {
    const { region, endpoint, serviceName, enableXRay } = opts
    return {
      module: SettingsModule,
      controllers: [SettingsController],
      imports: [LoggerModule, ClsModule],
      providers: [
        SettingsService,
        {
          provide: SETTINGS_SERVICE_PROVIDER,
          useValue: {
            region,
            endpoint,
            serviceName,
            enableXRay
          }
        }
      ],
      exports: [SettingsService]
    }
  }
}
