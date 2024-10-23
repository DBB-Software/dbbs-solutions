import { registerRootComponent } from 'expo'
import * as Sentry from '@sentry/react-native'

import App from './AppEntryPoint'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(Sentry.wrap(App))
