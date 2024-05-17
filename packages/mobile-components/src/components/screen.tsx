import React, { FC, ReactElement, ReactNode } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { useAppTheme } from '../hooks'

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

const styles = StyleSheet.create({
  centred: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  screen: {
    flex: 1,
    width: '100%'
  }
})
