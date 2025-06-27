import { AttributeValue } from '@aws-sdk/client-dynamodb'

export interface PageItem {
  url?: {
    S: string
  }
  statusName?: {
    S: string
  }
  code?: {
    S: string
  }
  attempts?: {
    N: number
  }
  status?: {
    S: string
  }
  previousStatus?: {
    S: string
  }
  previousCode?: {
    S: string
  }
  headers?: {
    L: []
  }
  keyword?: {
    S: string
  }
}

export interface ItemsResult {
  Items: PageItem[]
  LastEvaluatedKey: Record<string, AttributeValue> | undefined
}
export interface APIDoctifyEvent {
  url?: string
  payload?: {
    tenant?: string
    contentType?: string
    exceptCode?: string
    keywordName?: string
  }
}

export interface QueryParams {
  limit: number
  lastEvaluatedKey?: Record<string, AttributeValue>
  tenant?: string
}

export interface ScanResult {
  scanResults: PageType[]
  lastEvaluatedKey: Record<string, AttributeValue> | undefined
}

export type PageType = {
  url: string
  status: string
  code: string
  keyword: string
  previousStatus?: string
  previousCode?: string
  attempts?: number
  headers?: []
}
