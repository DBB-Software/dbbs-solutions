export interface CrawlParameters {
  url: string
  status?: string
  statusCode?: number
  urlKeyword?: string
}

export interface CrawlResult {
  url: string
  fetchedAt: string
  code: number
  previousCode: number | undefined
  status: string
  previousStatus: string | undefined
  headers: {
    S: string
  }[]
  urlKeyword: string | undefined
}
