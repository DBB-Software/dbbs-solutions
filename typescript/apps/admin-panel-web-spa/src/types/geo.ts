import { MeetingType } from './meetingType'

export type Geo = {
  id: string
  bubbleId: string
  modifiedDate?: string
  createdDate?: string
  createdBy?: string
  name: string
  scheduleUrl: string
  meetingType?: MeetingType
  timezone?: string
  captureScheduleFlag?: boolean
  captureStreamFlag?: boolean
  scheduleFormat?: string
  streamType?: string
  jurisdiction?: boolean
  parent?: Geo
  geoParentId?: number
  meetingTypeId?: number
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
