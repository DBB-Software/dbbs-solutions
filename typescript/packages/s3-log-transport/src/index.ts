import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

/**
 * Default number of logs to batch before uploading.
 * @constant
 * @type {number}
 */
const DEFAULT_BATCH_SIZE = 5 // logs in a row

/**
 * Default interval for uploading logs in milliseconds.
 * @constant
 * @type {number}
 */
const DEFAULT_UPLOAD_INTERVAL_MS = 5000

/**
 * Options for configuring the S3 transport.
 * @typedef {Object} IS3TransportOptions
 * @property {string} bucket - The S3 bucket name.
 * @property {string} folder - The folder in the S3 bucket.
 * @property {number} [batchSize] - The number of logs to batch before uploading.
 * @property {number} [uploadInterval] - The interval in milliseconds for uploading logs.
 * @property {string} region - The AWS region.
 */
export interface IS3TransportOptions {
  bucket: string
  folder: string
  batchSize?: number
  uploadInterval?: number
  region: string
}

/**
 * Creates an S3 transport for logging.
 * @function
 * @param {IS3TransportOptions} opts - The options for configuring the S3 transport.
 * @returns {Object} The transport with a write method for logging.
 */
function S3Transport(opts: IS3TransportOptions) {
  const { bucket, folder, region, batchSize = DEFAULT_BATCH_SIZE, uploadInterval = DEFAULT_UPLOAD_INTERVAL_MS } = opts
  const logBuffer: string[] = []
  const pmInstanceId = process.env.pm_id ?? 0

  const s3 = new S3Client({
    region
  })

  /**
   * Flushes the log buffer to S3.
   * @async
   * @function
   * @param {number} [size=logBuffer.length] - The number of logs to flush.
   */
  async function flush(size: number = logBuffer.length) {
    if (size > 0) {
      try {
        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: `${folder}/${new Date().toISOString()}{INSTANCE-${pmInstanceId}}.log`,
            Body: logBuffer.splice(0, size).join('\n')
          })
        )
      } catch (err) {
        console.error(err)
      }
    }
  }

  /**
   * Initializes the timer for batching and uploading logs.
   * @function
   */
  function initBatchTimer() {
    setInterval(() => {
      flush()
    }, uploadInterval)
  }

  /**
   * Writes a log message to the buffer.
   * @function
   * @param {string} msg - The log message.
   */
  function write(msg: string) {
    // TODO: make concurrent writing to buffer (#206)
    logBuffer.push(msg)

    if (logBuffer.length >= batchSize) {
      flush(batchSize)
    }
  }

  initBatchTimer()

  return { write }
}

export default S3Transport
