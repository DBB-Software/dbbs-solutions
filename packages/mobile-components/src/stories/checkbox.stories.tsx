import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox, CheckboxProps } from 'react-native-paper'

const DEFAULT_ARGS: CheckboxProps = {
  status: 'checked',
  onPress: () => console.log('onPress')
}

const meta: Meta<typeof Checkbox> = {
  title: 'Checkbox',
  component: Checkbox,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicUnchecked: Story = {
  args: { status: 'unchecked' }
}
export const BasicDisabled: Story = {
  args: { disabled: true }
}
