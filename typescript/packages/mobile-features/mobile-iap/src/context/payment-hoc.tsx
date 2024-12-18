import { withIAPContext } from 'react-native-iap'
import { useInitializeIAPConnection } from '../hooks'

export const withMobilePaymentContext = <T extends object>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> =>
  withIAPContext((props: T) => {
    useInitializeIAPConnection()

    return <WrappedComponent {...props} />
  })
