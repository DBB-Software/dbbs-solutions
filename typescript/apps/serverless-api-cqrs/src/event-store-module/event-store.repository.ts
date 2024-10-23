import { Injectable } from '@nestjs/common'
import { InjectKnex, Knex } from 'nestjs-knex'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { Event, StoredEvent } from '../types/common.js'

/**
 * Repository for managing event store operations.
 *
 * @class EventStoreRepository
 */
@Injectable()
export class EventStoreRepository {
  private tableName: string = 'events'

  /**
   * Constructs an instance of EventStoreRepository.
   *
   * @param {Knex} knex - The knex instance for database operations.
   * @param {Logger} logger - The logger instance.
   */
  constructor(
    // @ts-ignore
    @InjectKnex() private readonly knex: Knex,
    @InjectLogger(EventStoreRepository.name) private readonly logger: Logger
  ) {}

  /**
   * Initializes the repository and creates the events table if it doesn't exist.
   *
   * This method is called during the module initialization phase.
   */
  async onModuleInit() {
    if (!(await this.knex.schema.hasTable(this.tableName))) {
      await this.knex.schema.createTable(this.tableName, (table) => {
        table.increments('id').primary()
        table.string('aggregateId')
        table.string('eventName')
        table.jsonb('eventBody')
      })
    }
  }

  /**
   * Retrieves events by aggregate ID.
   *
   * @param {string} id - The aggregate ID.
   * @returns {Promise<StoredEvent[]>} The list of stored events.
   *
   * This method queries the event store to retrieve all events associated with a specific aggregate ID.
   */
  async getEventsByAggregateId(id: string): Promise<StoredEvent[]> {
    return this.knex.table(this.tableName).where({ aggregateId: id })
  }

  /**
   * Saves events to the event store.
   *
   * @param {string} aggregateId - The aggregate ID.
   * @param {Event[]} events - The list of events to save.
   * @returns {Promise<boolean>} Whether the events were successfully saved.
   *
   * This method inserts a list of events into the event store, associated with the specified aggregate ID.
   */
  async saveEvents(aggregateId: string, events: Event[]): Promise<boolean> {
    if (!aggregateId) {
      this.logger.warn('Can not save events. Aggregate ID is not defined.')
      return false
    }

    const result = await this.knex.table(this.tableName).insert(
      events.map((e) => ({
        aggregateId,
        eventName: e.constructor.name,
        eventBody: e.toJson()
      }))
    )
    this.logger.info({ message: 'saveEvents result:', body: result })

    return true
  }
}
