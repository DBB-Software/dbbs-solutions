import { renderHook } from '@testing-library/react-hooks'
import notifee, { EventType } from '@notifee/react-native'
import { useRNPushNotificationNavigation } from '../../src/hooks/useRNPushNotificationNavigation'

jest.mock('@notifee/react-native', () => ({
  getInitialNotification: jest.fn(),
  onBackgroundEvent: jest.fn(),
  onForegroundEvent: jest.fn(),
  EventType: {
    PRESS: 'PRESS'
  }
}))

describe('useRNPushNotificationNavigation', () => {
  const navigateToContent = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to content when an initial notification is received', async () => {
    const mockNotification = {
      notification: {
        data: {
          metadata: JSON.stringify({ screen: 'Home' })
        }
      }
    }
    const getInitialNotification = notifee.getInitialNotification as jest.Mock
    getInitialNotification.mockResolvedValue(mockNotification)

    renderHook(() => useRNPushNotificationNavigation({ navigateToContent }))

    expect(getInitialNotification).toHaveBeenCalled()
  })

  it('should navigate to content when a background notification is pressed', async () => {
    const mockEvent = {
      type: EventType.PRESS,
      detail: {
        notification: {
          data: {
            metadata: JSON.stringify({ screen: 'Profile' })
          }
        }
      }
    }
    const onBackgroundEvent = notifee.onBackgroundEvent as jest.Mock
    onBackgroundEvent.mockImplementation((callback) => {
      callback(mockEvent)
    })

    renderHook(() => useRNPushNotificationNavigation({ navigateToContent }))

    expect(onBackgroundEvent).toHaveBeenCalled()
    expect(navigateToContent).toHaveBeenCalledWith({ metadata: JSON.stringify({ screen: 'Profile' }) })
  })

  it('should navigate to content when a foreground notification is pressed', async () => {
    const mockEvent = {
      type: EventType.PRESS,
      detail: {
        notification: {
          data: {
            metadata: JSON.stringify({ screen: 'Settings' })
          }
        }
      }
    }
    const onForegroundEvent = notifee.onForegroundEvent as jest.Mock
    onForegroundEvent.mockImplementation((callback) => {
      callback(mockEvent)
    })

    renderHook(() => useRNPushNotificationNavigation({ navigateToContent }))

    expect(onForegroundEvent).toHaveBeenCalled()
    expect(navigateToContent).toHaveBeenCalledWith({ metadata: JSON.stringify({ screen: 'Settings' }) })
  })
})
