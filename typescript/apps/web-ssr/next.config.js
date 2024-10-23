const withSentryConfig = require('@dbbs/web-features/src/sentry/nextjs/withSentryConfig.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.BUILD_MODE || undefined,
  transpilePackages: ['@dbbs/tailwind-components', '@dbbs/web-features']
}

module.exports = withSentryConfig(nextConfig)
