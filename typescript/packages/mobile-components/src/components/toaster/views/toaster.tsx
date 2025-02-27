import React, { FC, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { Toast, ToasterProps } from '../core/types'
import { useToaster } from '../core/useToaster'
import { ToastComponent } from './toast'

export const Toaster: FC<ToasterProps> = ({ toastOptions, containerStyle, position = 'top', ...rest }) => {
  const mergedToastOptions = useMemo(
    () => ({ ...toastOptions, position: toastOptions?.position ?? position }),
    [position, toastOptions]
  )
  const { toasts, handlers } = useToaster(mergedToastOptions)
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, insets, containerStyle]}>
      {toasts.map((toast: Toast) => (
        <ToastComponent key={toast.id} toast={toast} position={position} handlers={handlers} {...rest} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '75%',
    pointerEvents: 'box-none',
    position: 'absolute',
    zIndex: 9999
  }
})
