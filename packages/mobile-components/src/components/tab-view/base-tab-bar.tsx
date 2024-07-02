import React, { FC, useCallback, useEffect, useMemo, useState, type ReactElement } from 'react'
import { View, Pressable, LayoutChangeEvent, StyleProp, TextStyle, useWindowDimensions } from 'react-native'
import { Text } from 'react-native-paper'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler'
import type { RenderTabBarProps, TabItem } from './tab-view'
import { useAppTheme } from '../../hooks'
import { styles } from './styles'

export interface BaseTabBarProps<T> extends RenderTabBarProps<T> {
  activeTabColor?: string
  renderTop?: () => ReactElement
  renderBottom?: () => ReactElement
}

interface BaseAnimatedTabProps extends Omit<TabItem, 'key' | 'component'> {
  activeTabColor?: string
  currentTabKey: string
  tabKey: string
  jumpTo: (key: string) => void
}

export const BaseAnimatedTab: FC<BaseAnimatedTabProps> = ({
  activeTabColor,
  currentTabKey,
  tabKey,
  title,
  testID,
  jumpTo
}) => {
  const { colors } = useAppTheme()
  const animatedWidth = useSharedValue(0)
  const [componentWidth, setComponentWidth] = useState(0)

  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: activeTabColor ?? colors.primary,
      borderRadius: 10,
      height: 2,
      width: animatedWidth.value
    }),
    [activeTabColor, animatedWidth.value]
  )
  const textStyles: StyleProp<TextStyle> = useMemo(
    () => ({ fontWeight: currentTabKey === tabKey ? 'bold' : '400', textAlign: 'center' }),
    [currentTabKey, tabKey]
  )

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setComponentWidth(event.nativeEvent.layout.width)
  }, [])

  const onPress = useCallback(() => jumpTo(tabKey), [jumpTo, tabKey])

  useEffect(() => {
    if (currentTabKey === tabKey) {
      animatedWidth.value = withTiming(componentWidth)
    } else {
      animatedWidth.value = withTiming(0)
    }
  }, [animatedWidth, componentWidth, currentTabKey, tabKey])

  return (
    <Pressable onPress={onPress} testID={`${testID}-pressable`} style={styles.tabItem}>
      <Text onLayout={onLayout} style={textStyles} testID={`${testID}-text`}>
        {title}
      </Text>
      <Animated.View style={animatedStyle} testID={`${testID}-animated`} />
    </Pressable>
  )
}

export const BaseTabBar = <T,>({
  navigationState,
  activeTabColor,
  renderTop,
  renderBottom,
  jumpTo
}: BaseTabBarProps<T>) => {
  const { width } = useWindowDimensions()
  const currentTab = useMemo(() => {
    return navigationState.routes[navigationState.index]
  }, [navigationState.index, navigationState.routes])

  return (
    <View style={styles.container}>
      {renderTop?.()}
      <GestureHandlerRootView>
        <ScrollView horizontal style={{ width }}>
          <View style={[styles.tabContainer, { minWidth: width }]}>
            {navigationState.routes.map((tab) => (
              <BaseAnimatedTab
                key={tab.key}
                title={tab.title}
                tabKey={tab.key}
                currentTabKey={currentTab.key}
                activeTabColor={activeTabColor}
                jumpTo={jumpTo}
                testID={tab.testID}
              />
            ))}
          </View>
        </ScrollView>
      </GestureHandlerRootView>
      {renderBottom?.()}
    </View>
  )
}
