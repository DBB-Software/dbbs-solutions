import Sitemapper from 'sitemapper'

export interface SitemapConfig {
  siteUrl: string
  proxyUrl: string
  tenants: string[]
  timeout?: number
}

export class SitemapHelper {
  private readonly siteUrl: string

  private readonly proxyUrl: string

  private readonly allowedRegions: Set<string>

  // @ts-ignore
  private readonly sitemapper: Sitemapper

  private readonly config: Partial<SitemapConfig> | undefined

  constructor(
    config?: Partial<SitemapConfig>,
    // @ts-ignore
    sitemapperInstance?: Sitemapper
  ) {
    this.config = config
    this.siteUrl = this.config?.siteUrl ?? process.env.SITE_URL ?? ''
    this.proxyUrl = this.config?.proxyUrl ?? process.env.PROXY_URL ?? ''

    const tenants =
      this.config?.tenants ?? (process.env.FETCH_TENANTS ? process.env.FETCH_TENANTS.split(', ') : ['uk', 'de', 'at'])

    this.allowedRegions = new Set(tenants)

    // Allow injection of sitemapper instance for testing
    this.sitemapper =
      sitemapperInstance ??
      // @ts-ignore
      new Sitemapper({
        timeout: this.config?.timeout ?? 30000
      })
  }

  public async fetchSitemap(urlToFetch: string): Promise<string[]> {
    try {
      const response = await this.sitemapper.fetch(urlToFetch)

      if (response.errors?.length) {
        console.log(`Errors ${response.errors.length} for url ${response.url}`)
      }

      return this.filterAndTransformUrls(response.sites)
    } catch (error) {
      console.error(`Failed to fetch sitemap from ${urlToFetch}:`, error)
      throw error
    }
  }

  private filterAndTransformUrls(sites: string[]): string[] {
    const startIndex = this.siteUrl.length + 1
    const endIndex = this.siteUrl.length + 3

    return sites
      .filter((site) => {
        const regionCode = site.slice(startIndex, endIndex)
        return this.allowedRegions.has(regionCode)
      })
      .map((site) => site.replace(this.siteUrl, this.proxyUrl))
  }
}
