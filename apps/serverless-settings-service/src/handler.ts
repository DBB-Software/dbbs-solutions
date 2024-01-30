import { CustomS3Handler, ICustomContext, loggerMiddleware } from '@dbbs/common'
import middy from '@middy/core'

export async function getSettings(event: { tenantId?: string }, context: ICustomContext): Promise<object> {
  const { SETTINGS_BUCKET, SETTINGS_FILE, REGION } = process.env

  if (!REGION) {
    throw new Error('No REGION variable provided')
  }

  if (!SETTINGS_BUCKET) {
    throw new Error('No SETTINGS_BUCKET variable provided')
  }

  if (!SETTINGS_FILE) {
    throw new Error('No SETTINGS_FILE variable provided')
  }

  const s3Handler = new CustomS3Handler(REGION as string)

  const { logger } = context

  logger.info(`Start getting settings from s3: ${SETTINGS_BUCKET} / ${SETTINGS_FILE}`)

  const settingObj = await s3Handler.downloadJSONfromS3({
    bucket: SETTINGS_BUCKET as string,
    key: SETTINGS_FILE as string
  })

  logger.info(`Finished getting settings from s3: ${SETTINGS_BUCKET} / ${SETTINGS_FILE}`)

  const { tenantId } = event

  if (!tenantId) {
    return settingObj
  }

  const result = settingObj.TENANTS[tenantId]

  if (!result) {
    throw new Error(`Tenant ${tenantId} does not exists in settings`)
  }

  return result
}

export const getSettingsHandler = middy(getSettings)
getSettingsHandler.use(loggerMiddleware())
