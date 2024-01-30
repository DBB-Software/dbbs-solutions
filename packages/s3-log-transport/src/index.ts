import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const DEFAULT_BATCH_SIZE = 5 // logs in a row
const DEFAULT_UPLOAD_INTERVAL_MS = 5000

export interface IS3TransportOptions {
  bucket: string
  folder: string
  batchSize?: number
  uploadInterval?: number
  region: string
}

function S3Transport(opts: IS3TransportOptions) {
  const { bucket, folder, region, batchSize = DEFAULT_BATCH_SIZE, uploadInterval = DEFAULT_UPLOAD_INTERVAL_MS } = opts
  const logBuffer: string[] = []
  const pmInstanceId = process.env.pm_id || 0

  const s3 = new S3Client({
    region
  })
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

  function initBatchTimer() {
    setInterval(() => {
      flush()
    }, uploadInterval)
  }

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
