import { AppRegistry } from 'react-native'
import AppEntryPoint from './AppEntryPoint'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => AppEntryPoint)
