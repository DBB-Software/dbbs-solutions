import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventStoreRepository } from './event-store.repository.js'

/**
 * Module for managing event store related dependencies and providers.
 *
 * @module EventStoreModule
 */
@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [EventStoreRepository],
  exports: [EventStoreRepository]
})
export class EventStoreModule {}
