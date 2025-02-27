import { StyleSheet } from 'react-native'
import { AppTheme } from '../../shared/types'

export const makeStyles = ({ colors }: AppTheme) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      elevation: 0
    },
    indicatorContainerStyle: {
      marginBottom: 16
    },
    indicatorStyle: { backgroundColor: colors.primary },
    label: {
      paddingBottom: 4
    },
    tabStyle: {
      paddingHorizontal: 4,
      width: 'auto'
    }
  })

  return styles
}
