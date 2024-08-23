import * as Sentry from '@sentry/nextjs'
import {
  init,
  registerSentry,
  setExtra,
  setTag,
  setUser,
  addBreadcrumb,
  captureEvent,
  captureMessage,
  captureException
} from './sentry'

// Mock the environment variables
const originalEnv = process.env
beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv }
  process.env.NEXT_PUBLIC_SENTRY_DSN = 'test-dsn'
})

afterEach(() => {
  process.env = originalEnv
  jest.clearAllMocks()
})

// Mock Sentry methods
jest.mock('@sentry/nextjs', () => ({
  init: jest.fn(),
  setExtra: jest.fn(),
  setTag: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn(),
  captureEvent: jest.fn(),
  captureMessage: jest.fn(),
  captureException: jest.fn()
}))

describe('Sentry Module', () => {
  describe('init', () => {
    it('should initialize Sentry with provided options and DSN from environment variable', () => {
      const options = { sampleRate: 0.5 }
      init(options)

      expect(Sentry.init).toHaveBeenCalledWith({
        dsn: 'test-dsn',
        ...options
      })
    })

    it('should initialize Sentry with default options when none are provided', () => {
      init()

      expect(Sentry.init).toHaveBeenCalledWith({
        dsn: 'test-dsn'
      })
    })
  })

  describe('registerSentry', () => {
    beforeEach(() => {
      jest.resetModules()
      jest.clearAllMocks()
    })

    it('should initialize Sentry with nodeOptions when runtime is nodejs', () => {
      process.env.NEXT_RUNTIME = 'nodejs'
      const nodeOptions = { environment: 'production' }

      registerSentry(nodeOptions)

      expect(Sentry.init).toHaveBeenCalledWith({
        dsn: 'test-dsn',
        ...nodeOptions
      })
    })

    it('should initialize Sentry with edgeOptions when runtime is edge', () => {
      process.env.NEXT_RUNTIME = 'edge'
      const edgeOptions = { environment: 'staging' }

      registerSentry({}, edgeOptions)

      expect(Sentry.init).toHaveBeenCalledWith({
        dsn: 'test-dsn',
        ...edgeOptions
      })
    })

    it('should not initialize Sentry when runtime is not nodejs or edge', () => {
      process.env.NEXT_RUNTIME = 'unknown'

      registerSentry()

      expect(Sentry.init).not.toHaveBeenCalled()
    })
  })

  describe('Sentry Methods', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should call setExtra with correct arguments', () => {
      const extraData = { key: 'value' }
      setExtra('extraKey', extraData)

      expect(Sentry.setExtra).toHaveBeenCalledWith('extraKey', extraData)
    })

    it('should call setTag with correct arguments', () => {
      const tagData = 'tagValue'
      setTag('tagKey', tagData)

      expect(Sentry.setTag).toHaveBeenCalledWith('tagKey', tagData)
    })

    it('should call setUser with correct arguments', () => {
      const userData = { id: 'user123' }
      setUser(userData)

      expect(Sentry.setUser).toHaveBeenCalledWith(userData)
    })

    it('should call addBreadcrumb with correct arguments', () => {
      const breadcrumb = { message: 'Breadcrumb message' }
      addBreadcrumb(breadcrumb)

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(breadcrumb)
    })

    it('should call captureEvent with correct arguments', () => {
      const event = { message: 'Event message' }
      captureEvent(event)

      expect(Sentry.captureEvent).toHaveBeenCalledWith(event)
    })

    it('should call captureMessage with correct arguments', () => {
      const message = 'Message text'
      captureMessage(message)

      expect(Sentry.captureMessage).toHaveBeenCalledWith(message)
    })

    it('should call captureException with correct arguments', () => {
      const error = new Error('Test error')
      captureException(error)

      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })
  })
})
