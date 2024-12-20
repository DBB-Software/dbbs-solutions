interface DefaultPushNotificationProps {
  onError: (error: unknown) => void
}

interface SubscribePushNotificationsProps extends DefaultPushNotificationProps {
  register: (token: string) => void
}
interface UnSubscribePushNotifications extends DefaultPushNotificationProps {
  unregister: (token: string) => void
}

export interface PushNotificationsContextType {
  subscribe: (props: SubscribePushNotificationsProps) => void
  unsubscribe: (props: UnSubscribePushNotifications) => void
  refreshToken: (callback?: (token: string) => void) => void
}
