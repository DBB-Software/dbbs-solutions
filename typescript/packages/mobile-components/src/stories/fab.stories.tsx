import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FAB, FABProps } from 'react-native-paper'

const DEFAULT_ARGS: FABProps = {
  label: 'label',
  onPress: () => console.log('Pressed')
}

const meta: Meta<typeof FAB> = {
  title: 'FAB',
  component: FAB,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicDisabled: Story = {
  args: { disabled: true }
}
export const Elevated: Story = {
  args: { mode: 'elevated' }
}
export const BasicPrimary: Story = {
  args: { variant: 'primary' }
}
export const BasicSecondary: Story = {
  args: { variant: 'secondary' }
}
export const BasicSurface: Story = {
  args: { variant: 'surface' }
}
export const BasicTertiary: Story = {
  args: { variant: 'tertiary' }
}
