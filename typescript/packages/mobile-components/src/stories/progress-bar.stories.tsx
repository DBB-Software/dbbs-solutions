import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar, ProgressBarProps } from 'react-native-paper'

const DEFAULT_ARGS: ProgressBarProps = {
  progress: 0.5
}

const meta: Meta<typeof ProgressBar> = {
  title: 'ProgressBar',
  component: ProgressBar,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
