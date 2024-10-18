import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Chip, ChipProps } from 'react-native-paper'

const DEFAULT_ARGS: ChipProps = {
  children: 'Example Chip',
  onPress: () => console.log('Pressed')
}

const meta: Meta<typeof Chip> = {
  title: 'Chip',
  component: Chip,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicIcon: Story = {
  args: { icon: 'information' }
}
export const BasicDisabled: Story = {
  args: { disabled: true }
}
export const Outlined: Story = {
  args: { mode: 'outlined' }
}
