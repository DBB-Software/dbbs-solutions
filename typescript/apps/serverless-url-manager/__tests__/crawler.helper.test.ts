import { jest } from '@jest/globals'
import { CrawlerHelper } from '../src/helpers/crawler.helper.js'
import { CrawlParameters } from '../src/types/crawl.js'

// Mock axios
jest.mock('axios')

// Mock cheerio
jest.mock('cheerio', () => ({
  load: jest.fn()
}))

describe('CrawlerHelper', () => {
  let crawlerHelper: CrawlerHelper
  const mockAxiosInstance = {
    get: jest.fn<() => Promise<any>>(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock the createAxiosInstance method to return our mock instance
    jest.spyOn(CrawlerHelper.prototype as any, 'createAxiosInstance').mockReturnValue(mockAxiosInstance)

    crawlerHelper = new CrawlerHelper(3)
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with correct attempts count', () => {
      const helper = new CrawlerHelper(5)
      expect(helper['attempts']).toBe(5)
    })
  })

  describe('crawlPage', () => {
    const mockCrawlParams: CrawlParameters = {
      url: 'https://example.com',
      urlKeyword: 'test-keyword',
      status: 'OK',
      statusCode: 200
    }

    it('should return crawl result when fetch is successful', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'text/html' },
        data: '<html><body>Test</body></html>'
      }

      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await crawlerHelper.crawlPage(mockCrawlParams)

      expect(result).toEqual({
        url: mockCrawlParams.url,
        fetchedAt: expect.any(String),
        code: 200,
        previousCode: 200,
        status: 'OK',
        previousStatus: 'OK',
        headers: expect.any(Array),
        urlKeyword: 'test-keyword'
      })
    })

    it('should return undefined when no results are fetched', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'))

      const result = await crawlerHelper.crawlPage(mockCrawlParams)

      expect(result?.code).toEqual(500)
      expect(result?.urlKeyword).toEqual('test-keyword')
      expect(result?.url).toEqual('https://example.com')
      expect(result?.previousCode).toEqual(200)
    })
  })

  describe('fetchWithRetry', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    it('should retry the specified number of times on success', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        data: '<html></html>'
      }

      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const fetchPromise = crawlerHelper['fetchWithRetry']('https://example.com', 1000)

      // Fast-forward through all delays
      for (let i = 0; i < 3; i++) {
        await jest.advanceTimersByTimeAsync(1000)
      }

      const results = await fetchPromise

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3)
      expect(results).toHaveLength(3)
      expect(results[0]).toEqual({
        status: 200,
        statusText: 'OK',
        headers: {},
        date: expect.any(Date),
        data: '<html></html>'
      })
    })

    it('should handle response errors correctly', async () => {
      const mockError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          headers: {},
          data: 'Not found'
        },
        message: 'Request failed with status code 404'
      }

      mockAxiosInstance.get.mockRejectedValue(mockError)

      const fetchPromise = crawlerHelper['fetchWithRetry']('https://example.com', 1000)

      // Fast-forward through all delays
      for (let i = 0; i < 3; i++) {
        await jest.advanceTimersByTimeAsync(1000)
      }

      const results = await fetchPromise

      expect(results).toHaveLength(6)
      expect(results[0]).toEqual({
        status: 404,
        statusText: 'Not Found',
        headers: {},
        data: 'Not found'
      })
    })

    it('should handle request timeout errors', async () => {
      const mockError = {
        request: {},
        response: {
          status: 504,
          statusText: 'Gateway Timeout'
        },
        message: 'timeout of 10000ms exceeded'
      }

      mockAxiosInstance.get.mockRejectedValue(mockError)

      const fetchPromise = crawlerHelper['fetchWithRetry']('https://example.com', 1000)

      // Fast-forward through all delays
      for (let i = 0; i < 3; i++) {
        await jest.advanceTimersByTimeAsync(1000)
      }

      const results = await fetchPromise

      expect(results).toHaveLength(9)

      const firstError = results[0]
      expect(firstError?.status).toEqual(504)
      expect(firstError?.statusText).toEqual('Gateway Timeout')
    })

    it('should handle other errors', async () => {
      const mockError = {
        message: 'Network Error'
      }

      mockAxiosInstance.get.mockRejectedValue(mockError)

      const fetchPromise = crawlerHelper['fetchWithRetry']('https://example.com', 1000)

      // Fast-forward through all delays
      for (let i = 0; i < 3; i++) {
        await jest.advanceTimersByTimeAsync(1000)
      }

      const results = await fetchPromise

      expect(results).toHaveLength(3)
      expect(results[0]).toEqual({
        status: 500,
        statusText: 'Internal Server Error',
        date: expect.any(Date),
        errorMessage: 'Other error',
        data: ''
      })
    })
  })

  describe('parseResults', () => {
    it('should return result with highest status code', () => {
      const mockResults = [
        {
          status: 200,
          statusText: 'OK',
          headers: {},
          date: new Date(),
          data: '<html></html>'
        },
        {
          status: 404,
          statusText: 'Not Found',
          headers: {},
          date: new Date(),
          data: ''
        }
      ]

      const result = crawlerHelper['parseResults'](mockResults)

      expect(result.status).toBe(404) // maxBy returns the one with highest status
      expect(result.statusText).toBe('Not Found')
      expect(result.headers).toHaveLength(2)
    })

    it('should return 404 when no results provided', () => {
      const result = crawlerHelper['parseResults']([])

      expect(result).toEqual({
        date: '',
        status: 404,
        statusText: 'Not Found',
        headers: []
      })
    })

    it('should include error messages in headers', () => {
      const mockResults = [
        {
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          date: new Date(),
          data: '',
          errorMessage: 'Connection timeout'
        }
      ]

      const result = crawlerHelper['parseResults'](mockResults)

      expect(result.headers).toHaveLength(2) // One for headers, one for error message
      expect(result.headers[1].S).toBe('"Connection timeout"')
    })
  })
})
