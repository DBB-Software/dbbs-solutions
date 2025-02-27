import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper'

export type DarkAndLightTheme = typeof MD3LightTheme | typeof MD3DarkTheme

export type AppTheme = DarkAndLightTheme & MD3Theme
