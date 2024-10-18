import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native-paper'

const DEFAULT_ARGS: ActivityIndicatorProps = {
  animating: true,
  color: 'blue'
}

const meta: Meta<typeof ActivityIndicator> = {
  title: 'ActivityIndicator',
  component: ActivityIndicator,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const BasicBlue: Story = {}
export const BasicGreen: Story = {
  args: { color: 'green' }
}
export const BasicLarge: Story = {
  args: { size: 'large' }
}
export const BasicCustomSize: Story = {
  args: { size: 32 }
}
export const BasicSmall: Story = {
  args: { size: 'small' }
}
