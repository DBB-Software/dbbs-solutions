import React, { FC } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Text } from 'react-native-paper'
import { useAppTheme } from '../../../shared/hooks'
import { resolveValue, type Toast } from '../core/types'

interface ToastBarProps {
  toast: Toast
  toastBarStyle?: ViewStyle
}

const transparentColor = 'transparent'
const blankColor = '#fff'
const blackColor = ' #000'

const ColorMapper = {
  loading: 'secondary' as 'secondary',
  error: 'error' as 'error',
  success: 'primary' as 'primary'
}

export const ToastBar: FC<ToastBarProps> = ({ toast, toastBarStyle }) => {
  const theme = useAppTheme()
  const backgroundColor = theme.colors[ColorMapper[toast.type as keyof typeof ColorMapper]] ?? blankColor
  return (
    <View style={[styles.toastBar, toast.style]}>
      <View style={[styles.baseToast, { backgroundColor }, toastBarStyle]}>
        <Text style={(styles.message, { color: toast.type === 'blank' ? blackColor : blankColor })}>
          {resolveValue(toast.message, toast)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  baseToast: {
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    minHeight: 50,
    padding: 10,
    width: 300
  },
  message: {
    textAlign: 'center'
  },
  toastBar: {
    alignItems: 'center',
    backgroundColor: transparentColor,
    justifyContent: 'center'
  }
})
