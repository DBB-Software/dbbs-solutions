/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO remove this line
import middy from '@middy/core'
import type { Logger } from 'pino'
import { Readable } from 'stream'
import { loggerMiddleware, ICustomContext, CustomS3Handler, CustomSqsHandler } from '@dbbs/common'
import { IConfig, IDocumentUrl } from './interfaces/index.js'
import { envVars } from './constants.js'
import { getConfigValueOrThrow } from './utils/getConfigValueOrThrow.js'
import { createUniqueFileName } from './utils/createUniqueFileName.js'
import { sanitizeString } from './utils/sanitizeString.js'

const hasErrors = {
  value: false
}

// resolve config vars
const getConfig = (): IConfig => ({
  region: getConfigValueOrThrow(envVars.REGION),
  stage: getConfigValueOrThrow(envVars.STAGE),
  sqsQueueUrl: getConfigValueOrThrow(envVars.SQS_QUEUE_URL),
  s3BucketName: getConfigValueOrThrow(envVars.S3_DOCUMENTS_BUCKET),
  s3BucketUrl: getConfigValueOrThrow(envVars.S3_DOCUMENTS_BUCKET_URL)
})

// Save document to S3 and return S3 URL
const saveToS3 = async (
  { title, content, fileType }: { title: string; content: Readable; fileType: string },
  s3Handler: CustomS3Handler,
  bucketName: string,
  bucketUrl: string,
  logger: Logger
): Promise<string> => {
  const key = `<COUNTRY_CODE>/${createUniqueFileName(sanitizeString(title), fileType)}`

  logger.debug(`Uploading document to S3 with key: ${key}`)
  const { writeStream, promise } = await s3Handler.uploadFileStream({
    bucket: bucketName,
    contentType: 'text/plain',
    key
  })

  content.pipe(writeStream)
  await promise

  const docUrl = `${bucketUrl}/${key}`
  logger.debug(`Document uploaded to S3 successfully: ${docUrl}`)
  return docUrl
}

const processDocument = async (
  documentUrl: IDocumentUrl,
  s3Handler: CustomS3Handler,
  sqsHandler: CustomSqsHandler,
  s3BucketName: string,
  s3BucketUrl: string,
  logger: Logger
) => {
  const { url, title } = documentUrl

  try {
    logger.debug(`Fetching documents from URL: ${documentUrl}`)

    // replace with real data fetcher
    const fileType: 'xml' | 'pdf' = 'xml'
    const documentStream: Readable = new Readable()

    // save documents data to S3
    const uploadedDocUrl = await saveToS3(
      {
        title: url,
        content: documentStream,
        fileType
      },
      s3Handler,
      s3BucketName,
      s3BucketUrl,
      logger
    )

    // replace with real data fetcher
    const metadata = {}

    // send message to SQS
    const messageToSqs = {
      xmlUrl: url,
      pdfUrl: url,
      DocUrl: uploadedDocUrl,
      metadata: JSON.stringify({ title, ...metadata })
    }
    logger.debug(`Sending message to SQS: ${JSON.stringify(messageToSqs)}`)
    await sqsHandler.sendToSQS(messageToSqs)
    logger.debug('Message sent to SQS successfully.')

    logger.info(`Successfully processed document from URL: ${url}.`)
  } catch (error) {
    logger.error(`Failed to process document from URL: ${url}. Reason: ${error}`)
    hasErrors.value = true
  }
}

async function scrapeLatest(event: object, context: ICustomContext) {
  const { logger } = context

  try {
    logger.info('Starting scraping process...')
    const { region, stage, s3BucketName, s3BucketUrl, sqsQueueUrl } = getConfig()

    const s3Handler = new CustomS3Handler(region, stage === envVars.LOCAL_STAGE)
    const sqsHandler = new CustomSqsHandler(region, false, sqsQueueUrl)

    // Call your main function to fetch document data and then call processDocument to process it

    if (!hasErrors.value) {
      logger.info('Documents scraping finished successfully.')
    } else {
      logger.info('Documents scraping finished with errors.')
    }
  } catch (error) {
    logger.error(`Error during scraping documents. Reason: ${error}`)
    throw error
  }
}

export const handler = middy(scrapeLatest)

handler.use(loggerMiddleware())
