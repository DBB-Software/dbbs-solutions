import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper'

export const lightTheme = {
  ...MD3LightTheme
}

export const darkTheme = {
  ...MD3DarkTheme
}

export type DarkAndLightTheme = typeof lightTheme | typeof darkTheme

export type AppTheme = DarkAndLightTheme & MD3Theme
