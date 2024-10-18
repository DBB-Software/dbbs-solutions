import React, { FC, ReactElement, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useWindowDimensions, Modal, View, StyleProp, ViewStyle } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { clamp } from '../../utils'
import { styles } from './styles'

const BASE_MODAL_HEIGHT = 300
const BASE_CONTAINER_COLOR = 'rgba(50, 50, 50, 0.5)'
const BASE_MARKER_COLOR = 'gray'
const BASE_MODAL_COLOR = 'white'
const BASE_SCROLL_DURATION = 100

interface BottomHalfModalProps {
  isOpen: boolean
  modalHeight?: number
  containerColor?: string
  modalColor?: string
  markerColor?: string
  isContainerTransparent?: boolean
  scrollDuration?: number
  markerContainerStyles?: StyleProp<ViewStyle>
  markerStyles?: StyleProp<ViewStyle>
  children: ReactElement | ReactNode
  onClose: () => void
}

export const BottomHalfModal: FC<BottomHalfModalProps> = ({
  isOpen,
  modalHeight = BASE_MODAL_HEIGHT,
  containerColor = BASE_CONTAINER_COLOR,
  modalColor = BASE_MODAL_COLOR,
  markerColor = BASE_MARKER_COLOR,
  isContainerTransparent = false,
  scrollDuration = BASE_SCROLL_DURATION,
  markerContainerStyles,
  markerStyles,
  children,
  onClose
}) => {
  const { width, height } = useWindowDimensions()
  const containerHeight = useSharedValue(0)
  const prevModalHeight = useSharedValue(0)
  const currentModalHeight = useSharedValue(0)

  const populateAnimation = useCallback(
    (value: number) => withTiming(value, { easing: Easing.linear, duration: scrollDuration }),
    [scrollDuration]
  )

  const pan = Gesture.Pan()
    .minDistance(0)
    .onStart(() => {
      prevModalHeight.value = currentModalHeight.value
    })
    .onUpdate(({ translationY }) => {
      const scrollTo = prevModalHeight.value - translationY
      currentModalHeight.value = populateAnimation(clamp(scrollTo, 0, height))
    })
    .onTouchesUp(() => {
      const minOffset = (modalHeight * 30) / 100
      if (currentModalHeight.value <= minOffset) {
        onClose()
      } else {
        currentModalHeight.value = populateAnimation(modalHeight)
      }
    })
    .runOnJS(true)

  const animatedContainerStyles = useAnimatedStyle(
    () => ({
      height: containerHeight.value
    }),
    [containerHeight.value]
  )

  const animatedModalStyles = useAnimatedStyle(
    () => ({
      height: currentModalHeight.value
    }),
    [currentModalHeight.value]
  )

  const restContainerStyles = useMemo(
    () => ({ width, backgroundColor: isContainerTransparent ? 'transparent' : containerColor }),
    [containerColor, isContainerTransparent, width]
  )

  const restModalStyles = useMemo(() => ({ width, backgroundColor: modalColor }), [width, modalColor])

  const memoizedMarkerColor = useMemo(() => ({ backgroundColor: markerColor }), [markerColor])

  useEffect(() => {
    containerHeight.value = populateAnimation(isOpen ? height : 0)
    currentModalHeight.value = populateAnimation(isOpen ? modalHeight : 0)
  }, [containerHeight, currentModalHeight, height, modalHeight, isOpen, populateAnimation])

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose} transparent>
      <Animated.View style={[styles.container, animatedContainerStyles, restContainerStyles]}>
        <Animated.View style={[styles.modal, animatedModalStyles, restModalStyles]}>
          <GestureHandlerRootView>
            <GestureDetector gesture={pan}>
              <View style={[styles.gesture, markerContainerStyles]}>
                <View style={[styles.mark, memoizedMarkerColor, markerStyles]} />
              </View>
            </GestureDetector>
          </GestureHandlerRootView>
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}
