import React, { FC, useCallback, useMemo } from 'react'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useTheme } from 'react-native-paper'
import { styles } from './styles'

const DEFAULT_PLATFORM = 'ios'
const DEFAULT_TRANSLATE_VALUE = 16

interface PlatformSwitchProps {
  value: boolean
  isDisabled?: boolean
  platform?: 'android' | 'ios'
  translateTo?: number
  containerStyle?: StyleProp<ViewStyle>
  toggleStyle?: StyleProp<ViewStyle>
  disabledContainerStyle?: StyleProp<ViewStyle>
  disabledToggleStyle?: StyleProp<ViewStyle>
  onValueChange: (value: boolean) => void
}

export const PlatformSwitch: FC<PlatformSwitchProps> = ({
  value,
  isDisabled,
  platform = DEFAULT_PLATFORM,
  translateTo = DEFAULT_TRANSLATE_VALUE,
  containerStyle,
  toggleStyle,
  disabledContainerStyle,
  disabledToggleStyle,
  onValueChange
}) => {
  const { colors } = useTheme()
  const togglePosition = useSharedValue(0)

  const activeStyles: ViewStyle = useMemo(
    () => (value ? { backgroundColor: colors.primary } : { backgroundColor: colors.outline }),
    [colors.outline, colors.primary, value]
  )
  const { container, toggle } = useMemo(
    () =>
      platform === 'ios'
        ? { container: styles.iOSContainer, toggle: styles.iOSToggle }
        : { container: styles.androidContainer, toggle: styles.androidToggle },
    [platform]
  )
  const animatedToggleStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: togglePosition.value }]
    }),
    [togglePosition.value]
  )

  const onToggle = useCallback(() => {
    if (isDisabled) return
    onValueChange(!value)
    togglePosition.value = withTiming(!value ? translateTo : 0)
  }, [isDisabled, onValueChange, togglePosition, translateTo, value])

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onToggle}>
      <Animated.View
        style={[container, activeStyles, containerStyle, isDisabled && disabledContainerStyle]}
        testID="switch-container"
      >
        <Animated.View
          style={[toggle, animatedToggleStyle, toggleStyle, isDisabled && disabledToggleStyle]}
          testID="switch-toggle"
        />
      </Animated.View>
    </TouchableOpacity>
  )
}
