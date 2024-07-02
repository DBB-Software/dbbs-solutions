import { App } from './src/app'
import onDevice from './.ondevice'

const AppEntryPoint = process.env.STORYBOOK_ENABLED === 'true' ? onDevice : App

export default AppEntryPoint
