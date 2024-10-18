import * as Sentry from '@sentry/nextjs'

/**
 * Initializes Sentry with the provided options or environment variables.
 * The DSN is retrieved from the environment variable NEXT_PUBLIC_SENTRY_DSN.
 *
 * @param {Parameters<typeof Sentry.init>[0]} [options={}] - Configuration options for Sentry initialization.
 */
export const init = (options: Parameters<typeof Sentry.init>[0] = {}) =>
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    ...options
  })

/**
 * Registers Sentry initialization for Next.js instrumentation based on the runtime environment.
 * Initializes Sentry with node-specific or edge-specific options.
 *
 * @param {Parameters<typeof Sentry.init>[0]} [nodeOptions={}] - Configuration options specific to the Node.js runtime.
 * @param {Parameters<typeof Sentry.init>[0]} [edgeOptions={}] - Configuration options specific to the Edge runtime.
 */
export const registerSentry = (
  nodeOptions: Parameters<typeof Sentry.init>[0] = {},
  edgeOptions: Parameters<typeof Sentry.init>[0] = {}
) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    init(nodeOptions)
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    init(edgeOptions)
  }
}

/**
 * Exporting various Sentry methods for capturing and setting different types of data.
 */
export {
  setExtra,
  setTag,
  setUser,
  addBreadcrumb,
  captureEvent,
  captureMessage,
  captureException
} from '@sentry/nextjs'
