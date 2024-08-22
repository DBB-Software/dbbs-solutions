/**
 * Module dependencies.
 * @typedef {import('pino').Logger} Pino
 * @typedef {import('pm2')} PM2
 */

import { pino } from 'pino'
import pm2 from 'pm2'
import {
  AWS_S3_LOGS_BUCKET,
  AWS_S3_LOGS_FOLDER,
  AWS_S3_LOGS_REGION,
  LOGS_BUTCH_SIZE,
  LOGS_UPLOAD_INTERVAL_MS
} from './constants.js'

/**
 * Creates a logger instance with S3 log transport.
 * @type {Pino}
 */
const logger = pino({
  transport: {
    targets: [
      {
        target: '@dbbs/s3-log-transport',
        options: {
          region: AWS_S3_LOGS_REGION,
          uploadInterval: LOGS_UPLOAD_INTERVAL_MS,
          batchSize: LOGS_BUTCH_SIZE,
          bucket: AWS_S3_LOGS_BUCKET,
          folder: AWS_S3_LOGS_FOLDER
        }
      }
    ]
  }
})

/**
 * Represents the number of instances for the application.
 * @type {number|string}
 */
const INSTANCES = process.env.APP_INSTANCES_NUMBER || -1
/**
 * Represents the maximum memory for the application.
 * @type {number|string}
 */
const MAX_MEMORY = process.env.APP_MAX_MEMORY || 2048
/**
 * Represents the name of the application.
 * @type {string}
 */
const APP_NAME = 'server-api'

/**
 * Represents a packet received from PM2.
 * @typedef {PM2Packet} PM2Packet
 */
interface PM2Packet {
  id: number
  type: string
  topic: boolean
  data: object
  process: {
    name: string
  }
}

/**
 * Enumerates the types of events received from PM2.
 * @readonly
 * @enum {EventType}
 */
enum EventType {
  LOG_OUT = 'log:out',
  LOG_ERR = 'log:err'
}

/**
 * Represents the PM2 event bus.
 * @interface PM2Bus
 */
interface PM2Bus {
  on(event: EventType, callback: (packet: PM2Packet) => void): void
}

/**
 * Handles errors encountered during application launch.
 * @param {Error} err - The error encountered.
 * @returns {PM2Bus} The PM2 event bus.
 */
function onError(err: Error) {
  if (err) {
    logger.error('Error while launching applications', err.stack || err)
  }

  logger.info('PM2 and application has been successfully started')

  return pm2.launchBus((error: Error, pm2Bus: PM2Bus) => {
    if (error) {
      logger.error(error)
    }

    logger.info('[PM2] Log streaming started')
    pm2Bus.on(EventType.LOG_OUT, (packet: PM2Packet) => {
      logger.info(`[App:${packet.process.name}] ${packet.data}`)
    })

    pm2Bus.on(EventType.LOG_ERR, (packet: PM2Packet) => {
      logger.error(`[App:${packet.process.name}][Err] ${packet.data}`)
    })
  })
}

/**
 * Setup pm2 options and start the listener
 * @param {Error} err - The error encountered.
 */
pm2.connect((err: Error) => {
  if (err) {
    logger.error(err)
    process.exit(2)
  }

  const env = Object.keys(process.env).reduce(
    (result, key) => ({ ...result, ...{ key: process.env[key] as string } }),
    {}
  )

  /**
   * Represents the options for launching the PM2 process.
   * @type {pm2.StartOptions}
   */
  const pm2Options: pm2.StartOptions = {
    name: APP_NAME,
    exec_mode: 'cluster',
    instances: +INSTANCES,
    source_map_support: true,
    max_memory_restart: `${MAX_MEMORY}M`,
    env
  }

  pm2.start('./dist/main.js', pm2Options, onError)
})
