const withSentryConfig = require('@dbbs/web-features/src/sentry/nextjs/withSentryConfig.js')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  analyzerMode: 'json'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.BUILD_MODE || undefined,
  transpilePackages: ['@dbbs/tailwind-components', '@dbbs/web-features']
}

module.exports = withSentryConfig(withBundleAnalyzer(nextConfig))
