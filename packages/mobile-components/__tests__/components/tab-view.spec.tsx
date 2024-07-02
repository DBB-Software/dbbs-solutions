import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { RenderTabBarProps, TabView } from '../../src'

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

  it('renders the correct content when the tab changes', async () => {
    render(<TabView tabs={tabs} />)

    // Initially, Tab 1 content should be visible
    expect(screen.getByText('Tab 1 Content')).toBeTruthy()

    // Change to the second tab
    fireEvent.press(screen.getByTestId('tab-2-pressable'))

    const nextTab = await screen.findByTestId('tab-2-text')

    expect(nextTab).toBeTruthy()

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('uses a custom tab bar if provided', () => {
    const CustomTabBar = ({ navigationState }: RenderTabBarProps<unknown>) => (
      <Text>{`Custom Tab Bar - Current Index: ${navigationState.index}`}</Text>
    )

    render(<TabView tabs={tabs} CustomTabBar={CustomTabBar} />)

    // Check that the custom tab bar is rendered
    expect(screen.getByText('Custom Tab Bar - Current Index: 0')).toBeTruthy()
  })
})
