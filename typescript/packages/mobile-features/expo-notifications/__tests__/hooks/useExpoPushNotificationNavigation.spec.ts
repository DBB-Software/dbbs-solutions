import { renderHook } from '@testing-library/react-hooks'
import { addNotificationReceivedListener, addNotificationResponseReceivedListener } from 'expo-notifications'
import { useExpoPushNotificationNavigation } from '../../src'

jest.mock('expo-notifications', () => ({
  getLastNotificationResponseAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn()
}))

describe('useExpoPushNotificationNavigation', () => {
  const navigateToContent = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to content when a notification is received in the foreground', () => {
    const mockListener = jest.fn()
    // @ts-expect-error: addNotificationResponseReceivedListener is mocked
    addNotificationReceivedListener.mockImplementation((listener) => {
      mockListener.mockImplementation(listener)
      return { remove: jest.fn() }
    })

    renderHook(() => useExpoPushNotificationNavigation({ navigateToContent }))

    const notification = {
      request: {
        content: {
          data: {
            metadata: { screen: 'Profile' }
          }
        }
      }
    }
    mockListener(notification)

    expect(addNotificationReceivedListener).toHaveBeenCalled()
    expect(navigateToContent).toHaveBeenCalledWith({ screen: 'Profile' })
  })

  it('should navigate to content when a notification response is received', () => {
    const mockListener = jest.fn()
    // @ts-expect-error: addNotificationResponseReceivedListener is mocked
    addNotificationResponseReceivedListener.mockImplementation((listener) => {
      mockListener.mockImplementation(listener)
      return { remove: jest.fn() }
    })

    renderHook(() => useExpoPushNotificationNavigation({ navigateToContent }))

    const response = {
      notification: {
        request: {
          content: {
            data: {
              metadata: { screen: 'Settings' }
            }
          }
        }
      }
    }
    mockListener(response)

    expect(addNotificationResponseReceivedListener).toHaveBeenCalled()
    expect(navigateToContent).toHaveBeenCalledWith({ screen: 'Settings' })
  })
})
