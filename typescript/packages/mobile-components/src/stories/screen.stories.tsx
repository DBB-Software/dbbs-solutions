import React from 'react'
import { Text } from 'react-native'
import type { Meta, StoryObj } from '@storybook/react'
import { Screen } from '../components/screen'

const meta: Meta<typeof Screen> = {
  title: 'Screen',
  component: Screen,
  args: {
    centred: true,
    children: <Text>Hello World</Text>
  },
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
