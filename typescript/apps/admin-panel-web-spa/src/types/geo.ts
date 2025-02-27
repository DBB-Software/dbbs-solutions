import { LinkField } from './common'

export type Geo = {
  id: string
  bubbleId: string
  modifiedDate?: string
  createdDate?: string
  createdBy?: string
  name: string
  scheduleUrl: string
  geoType: string
  timezone?: string
  captureScheduleFlag?: boolean
  captureStreamFlag?: boolean
  scheduleFormat?: string
  streamType?: string
  jurisdiction?: boolean
  parent?: LinkField
  geoParentId?: number
  channelUrl?: string
  statusSchedule?: string
  detectStartMethod: string
  detectEndMethod: string
  statusStream?: string
  flagOnlyAgenda?: boolean
  flagOptInOnly?: boolean
  singlePlayerUrl?: string
  flagLive?: boolean
  detectEndOcrString?: string
  debug?: boolean
  demo?: boolean
  scheduleRefreshFrequency?: number
  streamTypeId?: number
}
export type GeoProperties = {
  geoTypes: string[]
  detectMethods: string[]
  statuses: string[]
  timezones: string[]
  scheduleFormats: string[]
  streamTypes: string[]
}
