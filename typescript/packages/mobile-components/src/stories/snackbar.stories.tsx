import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Snackbar, SnackbarProps } from 'react-native-paper'

const DEFAULT_ARGS: SnackbarProps = {
  children: 'Snackbar',
  visible: true,
  action: {
    label: 'Undo',
    onPress: () => console.log('onPress')
  },
  onDismiss: () => console.log('onDismiss')
}

const meta: Meta<typeof Snackbar> = {
  title: 'Snackbar',
  component: Snackbar,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = { args: DEFAULT_ARGS }
