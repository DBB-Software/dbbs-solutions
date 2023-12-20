import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IExample } from '../types/example.js'

@Injectable()
export class ExampleService {
  private readonly watermark: string

  constructor(
    private configService: ConfigService,
    @InjectLogger(ExampleService.name) private readonly logger: Logger
  ) {
    const watermark = this.configService.get('DBB_WATERMARK')
    if (!watermark) {
      throw new Error('watermark is not defined')
    }
    this.watermark = watermark
  }

  getExample(id: string): IExample {
    this.logger.info('Get example by ID %s', id)

    return { id, watermark: this.watermark }
  }
}
