import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { HelperText, HelperTextProps } from 'react-native-paper'

const DEFAULT_ARGS: HelperTextProps = {
  type: 'info',
  children: 'Helper text'
}

const meta: Meta<typeof HelperText> = {
  title: 'HelperText',
  component: HelperText,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicDisabled: Story = {
  args: { disabled: true }
}
export const Error: Story = {
  args: { type: 'error' }
}
