import Constants from 'expo-constants'
import { App } from './src/app'
import onDevice from './.ondevice'

const AppEntryPoint = Constants.expoConfig?.extra?.storybookEnabled === 'true' ? onDevice : App

export default AppEntryPoint
