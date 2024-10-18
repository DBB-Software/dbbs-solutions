import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { NavigationState, Route, SceneRendererProps } from 'react-native-tab-view'
import { TabView } from '../../src'

describe('TabView Component', () => {
  const Tab1 = () => <Text>Tab 1 Content</Text>
  const Tab2 = () => <Text>Tab 2 Content</Text>

  const tabs = [
    { key: 'tab1', title: 'Tab 1', component: Tab1, testID: 'tab-1' },
    { key: 'tab2', title: 'Tab 2', component: Tab2, testID: 'tab-2' }
  ]

  it('renders correctly with default settings', () => {
    render(<TabView tabs={tabs} />)

    // Check if the initial tab is rendered
    expect(screen.getByText('Tab 1 Content')).toBeTruthy()
  })

  it('uses a custom tab bar if provided', () => {
    const CustomTabBar = (renderProps: SceneRendererProps & { navigationState: NavigationState<Route> }) => (
      <Text>{`Custom Tab Bar - Current Index: ${renderProps.navigationState.index}`}</Text>
    )

    render(<TabView tabs={tabs} CustomTabBar={CustomTabBar} />)

    // Check that the custom tab bar is rendered
    expect(screen.getByText('Custom Tab Bar - Current Index: 0')).toBeTruthy()
  })
})
