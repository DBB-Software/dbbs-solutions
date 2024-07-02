import React from 'react'
import { Text } from 'react-native'
import type { Meta, StoryObj } from '@storybook/react'
import { TabView } from '../components/tab-view'

const tabs = [
  { key: 'tab1', title: 'Tab 1', component: () => <Text>Tab - 1</Text>, testID: 'tab-1' },
  { key: 'tab2', title: 'Tab 2', component: () => <Text>Tab - 2</Text>, testID: 'tab-2' }
]

const meta: Meta<typeof TabView> = {
  title: 'TabView',
  component: TabView,
  args: {
    tabs
  },
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
