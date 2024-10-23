import * as Sentry from '@sentry/react'

/**
 * Initializes Sentry with the provided options or environment variables.
 * The DSN is retrieved from the environment variable WEB_APP_SENTRY_DSN.
 *
 * @param {Parameters<typeof Sentry.init>[0]} [options={}] - Configuration options for Sentry initialization.
 */
export const init = (options: Parameters<typeof Sentry.init>[0] = {}) => {
  Sentry.init({
    dsn: process?.env?.WEB_APP_SENTRY_DSN,
    ...options
  })
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
  captureSession,
  captureException
} from '@sentry/react'
