/* eslint-disable no-undef */
/* eslint-disable no-new */
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'web-ssr',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws'
    }
  },
  async run() {
    new sst.aws.Nextjs('WebSSR')
  }
})
