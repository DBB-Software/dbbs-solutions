import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0
})
