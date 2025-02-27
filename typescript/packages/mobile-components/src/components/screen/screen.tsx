import React, { FC, ReactElement, ReactNode } from 'react'
import { View, ViewProps } from 'react-native'
import { useAppTheme } from '../../shared/hooks'
import { styles } from './styles'

interface ScreenProps extends ViewProps {
  children: ReactElement | ReactNode
  centred?: boolean
}

export const Screen: FC<ScreenProps> = (props) => {
  const { children, centred } = props
  const { colors } = useAppTheme()
  return (
    <View style={[styles.screen, centred && styles.centred, { backgroundColor: colors.background }]} {...props}>
      {children}
    </View>
  )
}
