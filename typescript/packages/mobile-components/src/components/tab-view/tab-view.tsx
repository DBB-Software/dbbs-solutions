import React, { type ComponentType, useCallback, useMemo, useState } from 'react'
import {
  TabView as RNTabView,
  Route,
  SceneMap,
  SceneRendererProps,
  NavigationState,
  TabBar
} from 'react-native-tab-view'
import type { Props as RNTabViewProps } from 'react-native-tab-view/lib/typescript/src/TabView'
import { Text } from 'react-native-paper'
import type { ItemTypeFromArray } from '../../shared/types'
import { useAppTheme } from '../../shared/hooks'
import { makeStyles } from './styles'

const DEFAULT_ACTIVE_TAB_INDEX = 0

export interface TabItem<T = unknown> extends Route {
  component: ComponentType<T>
}

export type RenderTabBar<T> = RNTabViewProps<TabItem<T>>['renderTabBar']
export type RenderTabBarProps<T> = ItemTypeFromArray<Parameters<NonNullable<RenderTabBar<T>>>>

interface TabViewProps<T>
  extends Omit<RNTabViewProps<TabItem<T>>, 'navigationState' | 'renderScene' | 'onIndexChange' | 'renderTabBar'> {
  tabs: TabItem<T>[]
  initialIndex?: number
  CustomTabBar?: ComponentType<SceneRendererProps & { navigationState: NavigationState<Route> }>
  baseTabBarProps?: RenderTabBarProps<T>
  onIndexChangeEvent?: (index: number) => void
}

type SceneMapParameters = ItemTypeFromArray<Parameters<typeof SceneMap>>

export const TabView = <T,>(props: TabViewProps<T>) => {
  const theme = useAppTheme()
  const styles = makeStyles(theme)
  const { tabs, onIndexChangeEvent, initialIndex, CustomTabBar, baseTabBarProps, ...restProps } = useMemo(
    () => props,
    [props]
  )
  const [index, setIndex] = useState(initialIndex ?? DEFAULT_ACTIVE_TAB_INDEX)

  const Scene = useMemo(() => {
    const scene = tabs.reduce<SceneMapParameters>((acc, curr) => {
      acc[curr.key] = curr.component as ComponentType<unknown>
      return acc
    }, {})

    return SceneMap(scene)
  }, [tabs])

  const handleOnIndexChange = useCallback(
    (i: number) => {
      setIndex(i)
      onIndexChangeEvent?.(i)
    },
    [onIndexChangeEvent]
  )

  const renderLabel = useCallback(
    ({ route }: { route: Route }) => <Text style={styles.label}>{route.title}</Text>,
    [styles.label]
  )

  const renderTabBar = useCallback(
    (renderProps: SceneRendererProps & { navigationState: NavigationState<Route> }) =>
      CustomTabBar ? (
        <CustomTabBar {...renderProps} />
      ) : (
        <TabBar
          {...renderProps}
          renderLabel={renderLabel}
          style={styles.container}
          tabStyle={styles.tabStyle}
          indicatorStyle={styles.indicatorStyle}
          indicatorContainerStyle={styles.indicatorContainerStyle}
          gap={16}
          scrollEnabled
          {...baseTabBarProps}
        />
      ),
    [CustomTabBar, baseTabBarProps, renderLabel, styles]
  )

  return (
    <RNTabView
      {...restProps}
      navigationState={{
        routes: tabs,
        index
      }}
      renderScene={Scene}
      onIndexChange={handleOnIndexChange}
      renderTabBar={renderTabBar}
    />
  )
}
