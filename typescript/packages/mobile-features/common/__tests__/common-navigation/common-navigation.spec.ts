import { renderHook } from '@testing-library/react-hooks'
import { CommonActions, NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { useCommonNavigation, COMMON_NAVIGATION_ERROR } from '../../src/common-navigation'

describe('useCommonNavigation', () => {
  let navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>

  beforeEach(() => {
    navigationRef = {
      isReady: jest.fn(),
      dispatch: jest.fn()
    } as unknown as NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>
    console.error = jest.fn()
  })

  it('should navigate when navigationRef is ready and routeName is provided', () => {
    const isReady = navigationRef.isReady as jest.Mock
    isReady.mockReturnValue(true)
    const { result } = renderHook(() => useCommonNavigation(navigationRef))

    result.current('TestRoute', { slug: 'test-slug' })

    expect(navigationRef.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate({
        name: 'TestRoute',
        key: 'test-slug',
        params: { slug: 'test-slug' }
      })
    )
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should log an error when navigationRef is not ready', () => {
    const isReady = navigationRef.isReady as jest.Mock
    isReady.mockReturnValue(false)
    const { result } = renderHook(() => useCommonNavigation(navigationRef))

    result.current('TestRoute')

    expect(navigationRef.dispatch).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(COMMON_NAVIGATION_ERROR)
  })

  it('should log an error when routeName is not provided', () => {
    const isReady = navigationRef.isReady as jest.Mock
    isReady.mockReturnValue(true)
    const { result } = renderHook(() => useCommonNavigation(navigationRef))

    result.current('')

    expect(navigationRef.dispatch).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(COMMON_NAVIGATION_ERROR)
  })
})
