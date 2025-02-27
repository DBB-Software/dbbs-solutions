import { initConnection, endConnection } from 'react-native-iap'
import { renderHook } from '@testing-library/react-hooks'
import { useInitializeIAPConnection } from '../../src/hooks/useInitializeIAPConnection'

describe('useInitializeIAPConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize IAP connection on mount', async () => {
    const initConnectionMock = initConnection as jest.Mock
    initConnectionMock.mockResolvedValue(true)

    renderHook(() => useInitializeIAPConnection())

    expect(initConnectionMock).toHaveBeenCalled()
  })

  it('should end IAP connection on unmount', () => {
    const { unmount } = renderHook(() => useInitializeIAPConnection())

    unmount()

    expect(endConnection).toHaveBeenCalled()
  })
})
