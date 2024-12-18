import { renderHook, act } from '@testing-library/react-hooks'
import { AppState } from 'react-native'
import { useAppState } from '../../src'

type HandlerFunction = (state: string) => void

jest.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }
}))

describe('useAppState', () => {
  let addEventListenerMock: jest.Mock
  let removeEventListenerMock: jest.Mock

  beforeEach(() => {
    addEventListenerMock = jest.fn()
    removeEventListenerMock = jest.fn()
    // @ts-expect-error - need to mock AppState event
    AppState.addEventListener.mockImplementation((_, handler) => {
      addEventListenerMock(handler)
      return {
        remove: removeEventListenerMock
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const testCases = [
    {
      description: 'should return the initial state',
      initialState: 'active' as 'active',
      expectedState: 'active' as 'active',
      action: () => {},
      callback: null
    },
    {
      description: 'should call onAppStateChangedToActive when app state changes to active',
      initialState: 'inactive' as 'inactive',
      expectedState: 'active' as 'active',
      action: (handler: HandlerFunction) => act(() => handler('active')),
      callback: 'onAppStateChangedToActive'
    },
    {
      description: 'should call onAppStateChangedToBackground when app state changes to background',
      initialState: 'active' as 'active',
      expectedState: 'background' as 'background',
      action: (handler: HandlerFunction) => act(() => handler('background')),
      callback: 'onAppStateChangedToBackground'
    },
    {
      description: 'should update appStateVisible when app state changes',
      initialState: 'active' as 'active',
      expectedState: 'inactive' as 'inactive',
      action: (handler: HandlerFunction) => act(() => handler('inactive')),
      callback: null
    }
  ]

  test.each(testCases)('$description', ({ initialState, expectedState, action, callback }) => {
    AppState.currentState = initialState

    const callbacks = {
      onAppStateChangedToActive: jest.fn(),
      onAppStateChangedToBackground: jest.fn()
    }

    const { result } = renderHook(() =>
      useAppState(callback ? { [callback]: callbacks[callback as keyof typeof callbacks] } : {})
    )

    if (action) {
      action(addEventListenerMock.mock.calls[0][0])
    }

    if (callback) {
      expect(callbacks[callback as keyof typeof callbacks]).toHaveBeenCalled()
    }

    expect(result.current.appStateVisible).toBe(expectedState)
  })
})
