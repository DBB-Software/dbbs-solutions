import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RadioButton, RadioButtonProps } from 'react-native-paper'

const DEFAULT_ARGS: RadioButtonProps = {
  value: 'first'
}

const meta: Meta<typeof RadioButton> = {
  title: 'RadioButton',
  component: RadioButton,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicDisabled: Story = {
  args: { disabled: true }
}
export const BasicChecked: Story = {
  args: { status: 'checked' }
}
