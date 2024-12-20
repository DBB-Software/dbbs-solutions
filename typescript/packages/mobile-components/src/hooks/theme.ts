import { useColorScheme } from 'react-native'
import { MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper'
import type { AppTheme } from '../core'

interface DefinedThemeProps {
  isDark?: boolean
  lightTheme?: AppTheme
  darkTheme?: AppTheme
}

export const useDefinedTheme = (props?: DefinedThemeProps) => {
  const colorScheme = useColorScheme()
  const lightTheme = props?.lightTheme || MD3LightTheme
  const darkTheme = props?.darkTheme || MD3DarkTheme

  const paperTheme = colorScheme === 'dark' || props?.isDark ? darkTheme : lightTheme

  return paperTheme
}

export const useAppTheme = useTheme<AppTheme>
