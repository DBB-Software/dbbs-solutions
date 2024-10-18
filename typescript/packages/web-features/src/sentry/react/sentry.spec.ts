import * as Sentry from '@sentry/react'
import {
  init,
  setExtra,
  setTag,
  setUser,
  addBreadcrumb,
  captureEvent,
  captureMessage,
  captureSession,
  captureException
} from './sentry'

// Mock the environment variables
const originalEnv = process.env
beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv }
  process.env.WEB_APP_SENTRY_DSN = 'test-dsn'
})

afterEach(() => {
  process.env = originalEnv
  jest.clearAllMocks()
})

// Mock Sentry methods
jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  setExtra: jest.fn(),
  setTag: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn(),
  captureEvent: jest.fn(),
  captureMessage: jest.fn(),
  captureSession: jest.fn(),
  captureException: jest.fn()
}))

describe('React Sentry Module', () => {
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

  describe('Sentry Methods', () => {
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

    it('should call captureSession with correct arguments', () => {
      const end = true
      captureSession(end)

      expect(Sentry.captureSession).toHaveBeenCalledWith(end)
    })

    it('should call captureException with correct arguments', () => {
      const error = new Error('Test error')
      captureException(error)

      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })
  })
})
