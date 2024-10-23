import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { IconButton, IconButtonProps } from 'react-native-paper'

const DEFAULT_ARGS: IconButtonProps = {
  icon: 'camera',
  onPress: () => console.log('Pressed')
}

const meta: Meta<typeof IconButton> = {
  title: 'IconButton',
  component: IconButton,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicDisabled: Story = {
  args: { disabled: true }
}
export const BasicLoading: Story = {
  args: { disabled: true }
}
export const Outlined: Story = {
  args: { mode: 'outlined' }
}
export const Contained: Story = {
  args: { mode: 'contained' }
}
export const ContainedTonal: Story = {
  args: { mode: 'contained-tonal' }
}
