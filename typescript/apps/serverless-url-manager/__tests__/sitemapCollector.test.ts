import { jest } from '@jest/globals'
import { SitemapCollector } from '../src/handlers/sitemapCollector.js'
import { SitemapHelper } from '../src/helpers/sitemap.helper.js'
import { SQSHelper } from '../src/helpers/sqs.helper.js'

// Mock environment variables
const MOCKED_ENV = {
  SITE_URL: 'https://example.com',
  LOAD_URL_SQS: 'load-url-sqs-queue',
  REGION: 'eu-west-2',
  STAGE: 'test'
}

// Create proper mocks for the helper classes
const mockFetchSitemap = jest.fn<(url: string) => Promise<string[]>>()
const mockSendBatchToSqs = jest.fn<(messages: any[], queueUrl: string) => Promise<void>>()

// Mock SitemapHelper
const mockSitemapHelper = {
  fetchSitemap: mockFetchSitemap
} as unknown as SitemapHelper

// Mock SQSHelper
const mockSQSHelper = {
  sendBatchToSqs: mockSendBatchToSqs
} as unknown as SQSHelper

describe('sitemapCollector', () => {
  let collector: SitemapCollector

  beforeEach(() => {
    jest.clearAllMocks()
    Object.entries(MOCKED_ENV).forEach(([key, value]) => {
      process.env[key] = value
    })
    
    // Create a new collector instance for each test
    collector = new SitemapCollector({ 
      sitemap: mockSitemapHelper, 
      sqs: mockSQSHelper 
    })
  })

  afterEach(() => {
    // Clean up environment variables
    Object.keys(MOCKED_ENV).forEach(key => {
      delete process.env[key]
    })
  })

  describe('constructor', () => {
    it('should initialize with correct sitemap URL from environment', () => {
      expect(collector).toBeDefined()
      // The urlToFetch is private, but we can test its usage in startSitemapFetch
    })

    it('should handle missing SITE_URL environment variable', () => {
      delete process.env.SITE_URL
      
      const newCollector = new SitemapCollector({ 
        sitemap: mockSitemapHelper, 
        sqs: mockSQSHelper 
      })
      
      expect(newCollector).toBeDefined()
    })
  })

  describe('startSitemapFetch', () => {
    it('should successfully fetch sitemap URLs and send to SQS', async () => {
      const mockUrls = [
        'https://example.com/page1',
        'https://example.com/page2',
        'https://example.com/page3'
      ]

      mockFetchSitemap.mockResolvedValue(mockUrls)
      mockSendBatchToSqs.mockResolvedValue(undefined)

      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      await collector.startSitemapFetch()

      // Verify sitemap was fetched with correct URL
      expect(mockFetchSitemap).toHaveBeenCalledTimes(1)
      expect(mockFetchSitemap).toHaveBeenCalledWith('https://example.com/sitemap.xml')

      // Verify URLs were sent to SQS in correct format
      expect(mockSendBatchToSqs).toHaveBeenCalledTimes(1)
      expect(mockSendBatchToSqs).toHaveBeenCalledWith(
        [
          { urlInput: 'https://example.com/page1' },
          { urlInput: 'https://example.com/page2' },
          { urlInput: 'https://example.com/page3' }
        ],
        'load-url-sqs-queue'
      )

      // Verify console logging
      expect(consoleInfoSpy).toHaveBeenCalledWith('Begin fetch of the urls from domain https://example.com/sitemap.xml')
      expect(consoleLogSpy).toHaveBeenCalledWith('Length of URLS: ', 3)
      expect(consoleInfoSpy).toHaveBeenCalledWith('Finished crawling')

      consoleInfoSpy.mockRestore()
      consoleLogSpy.mockRestore()
    })

    it('should handle empty sitemap response', async () => {
      mockFetchSitemap.mockResolvedValue([])
      mockSendBatchToSqs.mockResolvedValue(undefined)

      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      await collector.startSitemapFetch()

      expect(mockFetchSitemap).toHaveBeenCalledTimes(1)
      expect(mockSendBatchToSqs).toHaveBeenCalledWith([], 'load-url-sqs-queue')
      expect(consoleLogSpy).toHaveBeenCalledWith('Length of URLS: ', 0)

      consoleInfoSpy.mockRestore()
      consoleLogSpy.mockRestore()
    })

    it('should handle large number of URLs', async () => {
      // Create 100 URLs to test batch processing
      const mockUrls = Array.from({ length: 100 }, (_, i) => `https://example.com/page${i + 1}`)

      mockFetchSitemap.mockResolvedValue(mockUrls)
      mockSendBatchToSqs.mockResolvedValue(undefined)

      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      await collector.startSitemapFetch()

      expect(mockFetchSitemap).toHaveBeenCalledTimes(1)
      expect(mockSendBatchToSqs).toHaveBeenCalledTimes(1)
      
      const expectedMessages = mockUrls.map(url => ({ urlInput: url }))
      expect(mockSendBatchToSqs).toHaveBeenCalledWith(expectedMessages, 'load-url-sqs-queue')
      expect(consoleLogSpy).toHaveBeenCalledWith('Length of URLS: ', 100)

      consoleInfoSpy.mockRestore()
      consoleLogSpy.mockRestore()
    })

    it('should handle sitemap fetch errors', async () => {
      const sitemapError = new Error('Failed to fetch sitemap')
      mockFetchSitemap.mockRejectedValue(sitemapError)

      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

      await expect(collector.startSitemapFetch()).rejects.toThrow('Failed to fetch sitemap')

      expect(mockFetchSitemap).toHaveBeenCalledTimes(1)
      expect(mockSendBatchToSqs).not.toHaveBeenCalled()
      expect(consoleInfoSpy).toHaveBeenCalledWith('Begin fetch of the urls from domain https://example.com/sitemap.xml')

      consoleInfoSpy.mockRestore()
    })

    it('should handle SQS sending errors', async () => {
      const mockUrls = ['https://example.com/page1']
      const sqsError = new Error('Failed to send to SQS')

      mockFetchSitemap.mockResolvedValue(mockUrls)
      mockSendBatchToSqs.mockRejectedValue(sqsError)

      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      await expect(collector.startSitemapFetch()).rejects.toThrow('Failed to send to SQS')

      expect(mockFetchSitemap).toHaveBeenCalledTimes(1)
      expect(mockSendBatchToSqs).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith('Length of URLS: ', 1)

      consoleInfoSpy.mockRestore()
      consoleLogSpy.mockRestore()
    })

    it('should handle missing LOAD_URL_SQS environment variable', async () => {
      delete process.env.LOAD_URL_SQS

      const mockUrls = ['https://example.com/page1']
      mockFetchSitemap.mockResolvedValue(mockUrls)
      mockSendBatchToSqs.mockResolvedValue(undefined)

      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

      await collector.startSitemapFetch()

      expect(mockSendBatchToSqs).toHaveBeenCalledWith(
        [{ urlInput: 'https://example.com/page1' }],
        undefined // LOAD_URL_SQS is undefined
      )

      consoleInfoSpy.mockRestore()
    })

    it('should construct correct sitemap URL with different SITE_URL', async () => {
      process.env.SITE_URL = 'https://different-domain.com'
      
      // Create new collector with updated environment
      const newCollector = new SitemapCollector({ 
        sitemap: mockSitemapHelper, 
        sqs: mockSQSHelper 
      })

      mockFetchSitemap.mockResolvedValue(['https://different-domain.com/page1'])
      mockSendBatchToSqs.mockResolvedValue(undefined)

      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

      await newCollector.startSitemapFetch()

      expect(mockFetchSitemap).toHaveBeenCalledWith('https://different-domain.com/sitemap.xml')
      expect(consoleInfoSpy).toHaveBeenCalledWith('Begin fetch of the urls from domain https://different-domain.com/sitemap.xml')

      consoleInfoSpy.mockRestore()
    })

    it('should handle URLs with special characters', async () => {
      const mockUrls = [
        'https://example.com/page-with-dashes',
        'https://example.com/page_with_underscores',
        'https://example.com/page%20with%20spaces',
        'https://example.com/página-en-español'
      ]

      mockFetchSitemap.mockResolvedValue(mockUrls)
      mockSendBatchToSqs.mockResolvedValue(undefined)

      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

      await collector.startSitemapFetch()

      const expectedMessages = mockUrls.map(url => ({ urlInput: url }))
      expect(mockSendBatchToSqs).toHaveBeenCalledWith(expectedMessages, 'load-url-sqs-queue')

      consoleInfoSpy.mockRestore()
    })
  })
})