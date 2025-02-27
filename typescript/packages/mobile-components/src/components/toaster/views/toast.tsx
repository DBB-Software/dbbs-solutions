import React, { FC, ReactElement, ReactNode, useMemo, useEffect } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import Animated, {
  SlideInUp,
  SlideInDown,
  SlideOutUp,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated'
import { useToaster } from '../core/useToaster'
import { ToastBar } from './toast-bar'
import { resolveValue, type Toast, type ToastPosition } from '../core/types'
import { TOAST_EXPIRE_DISMISS_DELAY } from '../core/useStore'

interface ToastProps {
  toast: Toast
  position: ToastPosition
  handlers: ReturnType<typeof useToaster>['handlers']
  gutter?: number
  toastBarStyle?: ViewStyle
  children?: (toast: Toast) => ReactNode | ReactElement
}

export const ToastComponent: FC<ToastProps> = ({ toast, position, handlers, gutter, children, ...rest }) => {
  const { calculateOffset } = handlers

  const toastPosition = useMemo(() => toast.position || position, [position, toast.position])

  const offset = useSharedValue(0)

  const entering =
    toastPosition === 'top'
      ? SlideInUp.duration(TOAST_EXPIRE_DISMISS_DELAY)
      : SlideInDown.duration(TOAST_EXPIRE_DISMISS_DELAY)
  const exiting =
    toastPosition === 'top'
      ? SlideOutUp.duration(TOAST_EXPIRE_DISMISS_DELAY)
      : SlideOutDown.duration(TOAST_EXPIRE_DISMISS_DELAY)

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: withTiming(toastPosition === 'top' ? offset.value : -offset.value, { duration: 100 }) }]
    }),
    [offset, toastPosition]
  )

  const toastPositionStyles = useMemo(() => (toastPosition === 'top' ? { top: 0 } : { bottom: 0 }), [toastPosition])

  useEffect(() => {
    offset.value = calculateOffset(toast, {
      gutter
    })
  }, [calculateOffset, gutter, offset, toast])

  return (
    <Animated.View entering={entering} exiting={exiting} style={[styles.toast, animatedStyle, toastPositionStyles]}>
      {toast.type === 'custom' ? (
        resolveValue(toast.message, toast)
      ) : children ? (
        children(toast)
      ) : (
        <ToastBar toast={toast} {...rest} />
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toast: {
    left: 0,
    position: 'absolute',
    right: 0
  }
})
