import { SSTConfig } from 'sst'
import { NextjsSite } from 'sst/constructs'

export default {
  config() {
    return {
      name: 'web-ssr',
      region: 'eu-central-1'
    }
  },
  stacks(app) {
    app.stack(({ stack }) => {
      const site = new NextjsSite(stack, 'site', {
        edge: true
      })

      stack.addOutputs({
        SiteUrl: site.url
      })
    })
  }
} satisfies SSTConfig
