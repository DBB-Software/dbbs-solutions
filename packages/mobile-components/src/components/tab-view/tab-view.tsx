import React, { type ComponentType, useCallback, useMemo, useState } from 'react'
import { TabView as RNTabView, Route, SceneMap } from 'react-native-tab-view'
import type { Props as RNTabViewProps } from 'react-native-tab-view/lib/typescript/src/TabView'
import type { ItemTypeFromArray } from '../../types'
import { BaseTabBar, type BaseTabBarProps } from './base-tab-bar'

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
  CustomTabBar?: ComponentType<RenderTabBarProps<T>>
  baseTabBarProps?: Pick<BaseTabBarProps<T>, 'renderBottom' | 'renderTop' | 'activeTabColor'>
  onIndexChangeEvent?: (index: number) => void
}

type SceneMapParameters = ItemTypeFromArray<Parameters<typeof SceneMap>>

export const TabView = <T,>(props: TabViewProps<T>) => {
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

  const handleRenderTabBar = useCallback(
    (renderProps: RenderTabBarProps<T>) =>
      CustomTabBar ? <CustomTabBar {...renderProps} /> : <BaseTabBar {...renderProps} {...baseTabBarProps} />,
    [CustomTabBar, baseTabBarProps]
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
      renderTabBar={handleRenderTabBar}
    />
  )
}
