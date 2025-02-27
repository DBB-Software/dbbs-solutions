import { useIAP } from 'react-native-iap'
import { renderHook } from '@testing-library/react-hooks'
import { useMobilePayments } from '../../src/hooks/useMobilePayments'

describe('useMobilePayments', () => {
  const mockIAPContext: Partial<ReturnType<typeof useIAP>> = {
    connected: true,
    products: [],
    subscriptions: [],
    getProducts: jest.fn(),
    getSubscriptions: jest.fn()
  }

  beforeEach(() => {
    const useIAPMock = useIAP as jest.Mock
    useIAPMock.mockReturnValue(mockIAPContext)
  })

  it('should fetch products and subscriptions on mount', () => {
    const productSkus = ['product1', 'product2']
    const subscriptionSkus = ['sub1', 'sub2']

    renderHook(() => useMobilePayments({ productSkus, subscriptionSkus }))

    expect(mockIAPContext.getProducts).toHaveBeenCalledWith({ skus: productSkus })
    expect(mockIAPContext.getSubscriptions).toHaveBeenCalledWith({ skus: subscriptionSkus })
  })
})
