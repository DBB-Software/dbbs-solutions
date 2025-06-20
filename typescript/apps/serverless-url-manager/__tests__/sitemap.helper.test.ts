import { jest } from '@jest/globals'
import { SitemapHelper } from '../src/helpers/sitemap.helper'
import { SitemapperResponse } from 'sitemapper'

describe('SitemapHelper', () => {
  const mockSiteUrl = 'https://example.com'
  const mockProxyUrl = 'https://cdn.example.com'
  const defaultTenants = ['uk', 'de', 'at']

  // Mock sitemapper instance
  const mockSitemapper = {
    fetch: jest.fn<() => Promise<SitemapperResponse>>()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchSitemap', () => {
    let helper: SitemapHelper
    const testSitemapUrl = 'https://example.com/sitemap.xml'

    beforeEach(() => {
      helper = new SitemapHelper(
        {
          siteUrl: mockSiteUrl,
          proxyUrl: mockProxyUrl,
          tenants: defaultTenants
        },
        mockSitemapper as any
      )
    })

    it('should successfully fetch and filter sitemap URLs', async () => {
      const mockResponse: SitemapperResponse = {
        url: testSitemapUrl,
        sites: [
          'https://example.com/uk/page1',
          'https://example.com/de/page2',
          'https://example.com/at/page3',
          'https://example.com/fr/page4', // Should be filtered out
          'https://example.com/us/page5' // Should be filtered out
        ],
        errors: []
      }

      mockSitemapper.fetch.mockResolvedValue(mockResponse)

      const result = await helper.fetchSitemap(testSitemapUrl)

      expect(mockSitemapper.fetch).toHaveBeenCalledWith(testSitemapUrl)
      expect(result).toEqual([
        'https://cdn.example.com/uk/page1',
        'https://cdn.example.com/de/page2',
        'https://cdn.example.com/at/page3'
      ])
    })

    it('should handle empty sitemap response', async () => {
      const mockResponse: SitemapperResponse = {
        url: testSitemapUrl,
        sites: [],
        errors: []
      }

      mockSitemapper.fetch.mockResolvedValue(mockResponse)

      const result = await helper.fetchSitemap(testSitemapUrl)

      expect(result).toEqual([])
    })

    it('should log errors when sitemap fetch has errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      const mockResponse: SitemapperResponse = {
        url: testSitemapUrl,
        sites: ['https://example.com/uk/page1'],
        errors: [
          { type: 'Error', url: 'https://example.com/uk/page1', retries: 1 },
          { type: 'Error', url: 'https://example.com/uk/page2', retries: 1 }
        ]
      }

      mockSitemapper.fetch.mockResolvedValue(mockResponse)

      const result = await helper.fetchSitemap(testSitemapUrl)

      expect(consoleSpy).toHaveBeenCalledWith(`Errors 2 for url ${testSitemapUrl}`)
      expect(result).toEqual(['https://cdn.example.com/uk/page1'])

      consoleSpy.mockRestore()
    })

    it('should handle network errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Network timeout')

      mockSitemapper.fetch.mockRejectedValue(error)

      await expect(helper.fetchSitemap(testSitemapUrl)).rejects.toThrow('Network timeout')
      expect(consoleErrorSpy).toHaveBeenCalledWith(`Failed to fetch sitemap from ${testSitemapUrl}:`, error)

      consoleErrorSpy.mockRestore()
    })

    it('should filter URLs based on allowed regions', async () => {
      const mockResponse: SitemapperResponse = {
        url: testSitemapUrl,
        sites: [
          'https://example.com/uk/page1', // Allowed
          'https://example.com/de/page2', // Allowed
          'https://example.com/fr/page3', // Not allowed
          'https://example.com/es/page4', // Not allowed
          'https://example.com/at/page5' // Allowed
        ],
        errors: []
      }

      mockSitemapper.fetch.mockResolvedValue(mockResponse)

      const result = await helper.fetchSitemap(testSitemapUrl)

      expect(result).toHaveLength(3)
      expect(result).toEqual([
        'https://cdn.example.com/uk/page1',
        'https://cdn.example.com/de/page2',
        'https://cdn.example.com/at/page5'
      ])
    })

    it('should handle custom tenants', async () => {
      const customHelper = new SitemapHelper(
        {
          siteUrl: mockSiteUrl,
          proxyUrl: mockProxyUrl,
          tenants: ['us', 'ca']
        },
        mockSitemapper as any
      )

      const mockResponse: SitemapperResponse = {
        url: testSitemapUrl,
        sites: [
          'https://example.com/us/page1', // Should be included
          'https://example.com/ca/page2', // Should be included
          'https://example.com/uk/page3', // Should be filtered out
          'https://example.com/de/page4' // Should be filtered out
        ],
        errors: []
      }

      mockSitemapper.fetch.mockResolvedValue(mockResponse)

      const result = await customHelper.fetchSitemap(testSitemapUrl)

      expect(result).toEqual(['https://cdn.example.com/us/page1', 'https://cdn.example.com/ca/page2'])
    })
  })
})
