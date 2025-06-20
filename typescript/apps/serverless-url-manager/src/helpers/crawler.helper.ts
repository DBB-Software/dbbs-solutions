import axios, {
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
  RawAxiosResponseHeaders
} from 'axios'
import * as cheerio from 'cheerio'
import _ from 'lodash'

import { CrawlParameters, CrawlResult } from '../types/crawl.js'

interface FetchResult {
  status: number
  statusText: string
  headers?: RawAxiosResponseHeaders
  date?: Date
  errorMessage?: string
  data: string
  config?: {
    url: string
  }
}

interface ParsedResult {
  date: string
  status: number
  statusText: string
  headers: Array<{ S: string }>
}

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export class CrawlerHelper {
  private readonly axiosInstance: AxiosInstance

  protected attempts: number

  constructor(attempts: number) {
    this.attempts = attempts
    this.axiosInstance = this.createAxiosInstance()
  }

  async crawlPage({ url, urlKeyword, status, statusCode }: CrawlParameters): Promise<CrawlResult | undefined> {
    const results = await this.fetchWithRetry(url)
    if (results?.length) {
      const response = this.parseResults(results)
      return {
        url,
        fetchedAt: response.date,
        code: response.status,
        previousCode: statusCode,
        status: response.statusText,
        previousStatus: status,
        headers: response.headers,
        urlKeyword
      }
    }
    return undefined
  }

  // internal

  private createAxiosInstance(): AxiosInstance {
    const configs: CreateAxiosDefaults = {
      timeout: 10000
    }

    const instance = axios.create(configs)

    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // eslint-disable-next-line no-param-reassign
      config.headers['request-startTime'] = new Date().getTime()
      return config
    })

    instance.interceptors.response.use((response: AxiosResponse) => {
      const currentTime = new Date().getTime()
      const startTime = response.config.headers?.['request-startTime'] as number

      if (startTime) {
        response.headers['request-duration'] = `${(currentTime - startTime) / 1000} sec`
      }

      return response
    })

    return instance
  }

  private parseResults(values: FetchResult[]): ParsedResult {
    const element: FetchResult | undefined = _.maxBy(values, 'status')
    const headers: { S: string }[] = values.map((v: FetchResult) => ({ S: JSON.stringify(v.headers) }))
    if (!element) {
      return { date: '', status: 404, statusText: 'Not Found', headers: [] }
    }
    let { status, statusText } = element
    if (
      status === 200 &&
      element.config &&
      element.config.url.includes('/find/') &&
      (element.config.url.endsWith('/specialists') || element.config.url.endsWith('/practices'))
    ) {
      const $ = cheerio.load(element.data)
      const listItems = $('p')
      let isEmpty = false
      listItems.each((idx, el) => {
        if ($(el).hasClass('MuiTypography-root') && $(el).hasClass('MuiTypography-h2')) {
          isEmpty = true
        }
      })
      const isError = $('h1[class="next-error-h1"]').html()
      if (isEmpty) {
        status = 404
        statusText = 'Not Found'
      }
      if (isError) {
        status = 500
        statusText = 'Internal Server Error'
      }
    }
    if (element?.errorMessage) {
      headers.push({ S: JSON.stringify(element?.errorMessage) })
    }
    return {
      date: element!.date?.toString() ?? new Date().toISOString(),
      status,
      statusText,
      headers
    }
  }

  private async fetchWithRetry(url: string, delayMs: number = 4000): Promise<FetchResult[]> {
    const results: FetchResult[] = []
    console.log(`Try get ${url} with ${this.attempts}:`)
    for (let i = 0; i < this.attempts; i += 1) {
      try {
        await this.axiosInstance
          .get(url)
          .then((response) => {
            console.log(`Attempt number ${i + 1} for url ${url}`)
            const result: FetchResult = {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              date: new Date(),
              data: response.data
            }
            results.push(result)
          })
          .catch((error) => {
            console.log(`Error fetching ${url}: ${error.message}`)
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.status)
              console.log(error.response.headers)
              results.push(error.response as FetchResult)
            }
            if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request)
              results.push({
                status: error.response.status ?? 504,
                statusText: error.response.statusText ?? 'Gateway Timeout',
                date: new Date(),
                errorMessage: 'The request was made but no response was received',
                data: ''
              })
            }
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
            results.push({
              status: 500,
              statusText: 'Internal Server Error',
              date: new Date(),
              errorMessage: 'Other error',
              data: ''
            })
          })
        await delay(delayMs)
      } catch (e) {
        console.error(`Attempt ${i + 1} failed:`, e)
      }
    }

    return results
  }
}
