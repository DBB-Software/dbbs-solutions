import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ExampleController } from './example.controller.js'
import { ExampleService } from './example.service.js'

@Module({
  providers: [ExampleService],
  imports: [ConfigModule, LoggerModule],
  controllers: [ExampleController]
})
export class ExampleModule {}
