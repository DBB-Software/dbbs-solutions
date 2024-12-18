import middy from '@middy/core'
import { createReadStream } from 'fs'
import { spawnSync } from 'child_process'
import {
  loggerMiddleware,
  ICustomContext,
  CustomS3Handler,
  CustomSecretManagerHandler,
  IUploadFileStreamInput
} from '@dbbs/common'

const LOCAL_STAGE = 'local'
const BACKUP_FILE_PATH = '/tmp/backup.sql.gz'
const BASH_ERROR_CODE = 126

async function uploadFileToS3({
  region,
  filePath,
  bucket
}: {
  region: string
  stage: string
  filePath: string
  bucket: string
}) {
  const s3Handler = new CustomS3Handler(region)
  const s3Params: IUploadFileStreamInput = {
    bucket,
    key: `backup-${new Date().toISOString()}.sql.gz`
  }
  const { writeStream, promise } = await s3Handler.uploadFileStream(s3Params)

  const readStream = createReadStream(filePath)

  readStream.pipe(writeStream)

  await promise
}

async function uploadBackup(_: unknown, context: ICustomContext) {
  const { logger } = context
  const { REGION, STAGE, S3_BACKUP_BUCKET: bucket, RDS_SECRET: secretName } = process.env
  if (!REGION) {
    throw new Error('No REGION variable provided')
  }
  if (!STAGE) {
    throw new Error('No STAGE variable provided')
  }
  if (!bucket) {
    throw new Error('No S3_BACKUP_BUCKET variable provided')
  }
  if (!secretName) {
    throw new Error('No RDS_SECRET variable provided')
  }
  const secretsManager = new CustomSecretManagerHandler(REGION, STAGE === LOCAL_STAGE)

  const response = await secretsManager.getSecretValue(secretName)
  let connectionString = ''

  try {
    if (response.SecretString) {
      const {
        DATABASE_USERNAME: user,
        DATABASE_PASSWORD: password,
        DATABASE_HOST: host,
        DATABASE_PORT: port,
        DATABASE_NAME: dbname
      } = JSON.parse(response.SecretString)
      connectionString = `postgresql://${user}:${password}@${host}:${port}/${dbname}`
    }
    if (response.SecretBinary) {
      const buffer = Buffer.from(response.SecretBinary.toString(), 'base64')
      const {
        DATABASE_USERNAME: user,
        DATABASE_PASSWORD: password,
        DATABASE_HOST: host,
        DATABASE_PORT: port,
        DATABASE_NAME: dbname
      } = JSON.parse(buffer.toString())
      connectionString = `postgresql://${user}:${password}@${host}:${port}/${dbname}`
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error parsing secret: ${error.message}`)
    }
    throw error
  }

  // @ts-ignore
  if (connectionString === '') {
    throw new Error('Connection string is empty!')
  }

  // Run the backup script with 2 arguments, 1 - connection string, 2 - backup file path
  const result = spawnSync('./backup.sh', [connectionString, BACKUP_FILE_PATH], {
    encoding: 'utf-8',
    cwd: '/var/task'
  })

  if (result.error || result.status === BASH_ERROR_CODE) {
    logger.error(`Error: ${result.error?.message || result.stderr}`)
    throw result.error || new Error(result.stderr)
  }

  try {
    // Upload the backup file to S3
    await uploadFileToS3({ bucket, region: REGION, stage: STAGE, filePath: BACKUP_FILE_PATH })

    logger.info('File uploaded successfully')
  } catch (error) {
    logger.error((error as Error)?.message)
    const message = `Upload failed: ${BACKUP_FILE_PATH} to bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`
    throw new Error(message)
  }
}

export const uploadBackupRequest = middy(uploadBackup).use(loggerMiddleware())
