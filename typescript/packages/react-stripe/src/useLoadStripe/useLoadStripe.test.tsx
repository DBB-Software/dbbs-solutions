import { renderHook } from '@testing-library/react-hooks'
import { loadStripe } from '@stripe/stripe-js'

import useLoadStripe from './useLoadStripe'

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn()
}))

const mockedLoadStripe = loadStripe as jest.Mock

const PUBLIC_KEY = 'pk_test_123'
const MOCK_STRIPE_OBJECT = { some: 'stripeObject' }

describe('useLoadStripe', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call loadStripe with passed public key', async () => {
    mockedLoadStripe.mockResolvedValueOnce(MOCK_STRIPE_OBJECT)

    const { result } = renderHook(() => useLoadStripe(PUBLIC_KEY))

    expect(mockedLoadStripe).toHaveBeenCalledTimes(1)
    expect(mockedLoadStripe).toHaveBeenCalledWith(PUBLIC_KEY)

    const stripeResult = await result.current
    expect(stripeResult).toEqual(MOCK_STRIPE_OBJECT)
  })

  it('should memoize loadStripe result', async () => {
    mockedLoadStripe.mockResolvedValue(MOCK_STRIPE_OBJECT)

    const { result, rerender } = renderHook(({ key }) => useLoadStripe(key), {
      initialProps: { key: PUBLIC_KEY }
    })

    expect(mockedLoadStripe).toHaveBeenCalledTimes(1)
    const firstPromise = result.current

    rerender({ key: PUBLIC_KEY })
    expect(mockedLoadStripe).toHaveBeenCalledTimes(1)

    expect(result.current).toBe(firstPromise)

    rerender({ key: 'pk_test_otherKey' })
    expect(mockedLoadStripe).toHaveBeenCalledTimes(2)

    expect(result.current).not.toBe(firstPromise)
  })

  it('should return null if loadStripe returned error', async () => {
    mockedLoadStripe.mockImplementationOnce(() => {
      throw new Error('Failed to load')
    })

    const { result } = renderHook(() => useLoadStripe(PUBLIC_KEY))

    expect(mockedLoadStripe).toHaveBeenCalledTimes(1)
    expect(mockedLoadStripe).toHaveBeenCalledWith(PUBLIC_KEY)

    const stripeResult = await result.current
    expect(stripeResult).toBeNull()
  })
})
