/*  This file provides a JavaScript interface for the withSentryConfig function. 
    It allows us to use withSentryConfig in the Next.js configuration file (next.config.js), 
    which does not natively support TypeScript.
*/

const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig
