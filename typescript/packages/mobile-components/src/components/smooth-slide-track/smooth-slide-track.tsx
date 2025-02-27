import React, { Fragment, useCallback, useMemo, useState, JSX } from 'react'
import { useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated'
import { useAutoPlay } from '../../shared/hooks'
import { clamp, isPositiveNumber } from '../../shared/utils'
import { styles } from './styles'

const BASE_DURATION_OF_ANIMATION_ON_SWIPE = 100
const BASE_DURATION_OF_ANIMATION_PER_ITEM_WITH_AUTO_PLAY = 1000
const BASE_AUTO_PLAY_DURATION = 1000

interface SmoothSlideTrackProps<T> {
  data: T[]
  itemWidth: number
  durationOnSwipe?: number
  durationPerItem?: number
  autoPlayInterval?: number
  renderItem: (item: T) => JSX.Element | JSX.Element[]
  extraKey?: (item: T) => string
}

export const SmoothSlideTrack = <T,>({
  data,
  itemWidth,
  durationOnSwipe = BASE_DURATION_OF_ANIMATION_ON_SWIPE,
  durationPerItem = BASE_DURATION_OF_ANIMATION_PER_ITEM_WITH_AUTO_PLAY,
  autoPlayInterval = BASE_AUTO_PLAY_DURATION,
  renderItem: originalRenderItem,
  extraKey
}: SmoothSlideTrackProps<T>) => {
  const { width } = useWindowDimensions()
  const totalContentWidth = useMemo(() => data.length * itemWidth, [data.length, itemWidth])
  const maxTranslateX = useMemo(() => totalContentWidth - width, [totalContentWidth, width])
  const prevPosition = useSharedValue(0)
  const currentPosition = useSharedValue(0)
  const [isPositiveDirection, setIsPositiveDirection] = useState(0 - currentPosition.value === maxTranslateX)

  const getDuration = useCallback(() => {
    if (isPositiveDirection) {
      const remainingDistance = 0 - currentPosition.value
      const processedDistance = remainingDistance === 0 ? maxTranslateX : remainingDistance
      const currentNumberOfItems = Math.round(processedDistance / itemWidth)
      return currentNumberOfItems * durationPerItem
    }
    const remainingDistance = maxTranslateX + currentPosition.value
    const currentNumberOfItems = Math.round(remainingDistance / itemWidth)
    return currentNumberOfItems * durationPerItem
  }, [currentPosition.value, durationPerItem, isPositiveDirection, itemWidth, maxTranslateX])

  const baseAnimation = useCallback(
    () =>
      withRepeat(
        withTiming(isPositiveDirection ? clamp(maxTranslateX - width, -maxTranslateX, 0) : -maxTranslateX, {
          duration: data.length * durationPerItem,
          easing: Easing.linear
        }),
        // numberOfReps — The number of times the animation is going to be repeated. If we using -1, animation should be infinity.
        -1,
        true
      ),
    [data.length, durationPerItem, isPositiveDirection, maxTranslateX, width]
  )

  const startAnimation = useCallback(() => {
    if (currentPosition.value === 0) {
      currentPosition.value = baseAnimation()
    } else {
      // Need to slide track on base position, to start basic animation
      currentPosition.value = withTiming(
        isPositiveDirection ? 0 : -maxTranslateX,
        {
          duration: getDuration(),
          easing: Easing.linear
        },
        () => {
          cancelAnimation(currentPosition)
          runOnJS(setIsPositiveDirection)(!isPositiveDirection)
        }
      )
      // Waiting for ending previous animation
      setTimeout(() => {
        currentPosition.value = baseAnimation()
      }, getDuration())
    }
  }, [baseAnimation, currentPosition, getDuration, isPositiveDirection, maxTranslateX])

  const { play, stop } = useAutoPlay({
    autoPlayInterval,
    onStart: startAnimation,
    onStop() {
      cancelAnimation(currentPosition)
    }
  })

  const transformStyles = useAnimatedStyle(
    () => ({
      transform: [{ translateX: currentPosition.value }]
    }),
    [currentPosition.value]
  )

  const renderItem = useCallback(
    (item: T, index: number) => <Fragment key={extraKey ? extraKey(item) : index}>{originalRenderItem(item)}</Fragment>,
    [extraKey, originalRenderItem]
  )

  const pan = Gesture.Pan()
    .minDistance(0)
    .onStart(() => {
      prevPosition.value = currentPosition.value
    })
    .onUpdate((event) => {
      if (
        currentPosition.value === event.translationX ||
        (currentPosition.value >= 0 && event.translationX >= 0) ||
        (!isPositiveNumber(currentPosition.value) &&
          !isPositiveNumber(event.translationX) &&
          currentPosition.value === 0 - maxTranslateX)
      ) {
        return
      }
      const scrollTo = prevPosition.value + event.translationX
      const processedScrollDistance = clamp(scrollTo, -maxTranslateX, 0)
      currentPosition.value = withTiming(processedScrollDistance, {
        duration: durationOnSwipe
      })

      const isEndReached = maxTranslateX + processedScrollDistance === 0
      const precessedDistanceDirection = isEndReached ? true : isPositiveNumber(event.translationX)
      setIsPositiveDirection(processedScrollDistance === 0 ? false : precessedDistanceDirection)
    })
    .onTouchesDown(stop)
    .onTouchesUp(play)
    .runOnJS(true)

  return (
    <GestureHandlerRootView style={styles.gestureHandlerRootContainer}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.animatedContainer, { width: totalContentWidth }, transformStyles]}
          testID="smooth-slide-track"
        >
          {data.map(renderItem)}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}
