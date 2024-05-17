import { useTheme } from 'react-native-paper'
import { useColorScheme } from 'react-native'
import { AppTheme } from '@dbbs/mobile-components'
import { darkTheme, lightTheme } from '../core'

export const useDefinedTheme = (isDark = false) => {
  const colorScheme = useColorScheme()

  const paperTheme = colorScheme === 'dark' || isDark ? darkTheme : lightTheme

  return paperTheme
}

export const useAppTheme = useTheme<AppTheme>
