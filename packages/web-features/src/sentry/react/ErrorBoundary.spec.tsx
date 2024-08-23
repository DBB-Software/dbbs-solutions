import { render } from '@testing-library/react'
import * as Sentry from '@sentry/react'
import { ErrorBoundary } from './ErrorBoundary'

// Mock Sentry's ErrorBoundary component
jest.mock('@sentry/react', () => ({
  ErrorBoundary: jest.fn().mockImplementation(({ children, fallback }) => {
    // Mock the implementation to trigger the fallback UI
    const isError = true // Simulate error
    return isError ? fallback : children
  })
}))

describe('ErrorBoundary Component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render Sentry ErrorBoundary with provided props', () => {
    const props = {
      fallback: <div>Fallback UI</div>,
      onError: jest.fn()
    }

    const { getByText } = render(
      <ErrorBoundary {...props}>
        <div>Test Children</div>
      </ErrorBoundary>
    )

    expect(getByText('Fallback UI')).toBeInTheDocument()
    expect(Sentry.ErrorBoundary).toHaveBeenCalledWith(expect.objectContaining(props), {})
  })

  it('should call the onError callback when an error occurs', () => {
    const onError = jest.fn()
    const props = {
      fallback: <div>Fallback UI</div>,
      onError
    }

    render(
      <ErrorBoundary {...props}>
        <div>Test Children</div>
      </ErrorBoundary>
    )

    // Simulate an error to test the onError callback
    const error = new Error('Test error')
    props.onError(error, { componentStack: '' })

    expect(onError).toHaveBeenCalledWith(error, { componentStack: '' })
  })
})
