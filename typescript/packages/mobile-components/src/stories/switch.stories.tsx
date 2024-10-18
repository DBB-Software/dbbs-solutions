import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PlatformSwitch } from '../components/platform-switch'

const disabledContainerStyle = {
  backgroundColor: 'gray'
}
const disabledToggleStyle = {
  backgroundColor: 'darkgray'
}

const meta: Meta<typeof PlatformSwitch> = {
  title: 'PlatformSwitch',
  component: PlatformSwitch,
  args: {},
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const iOS: Story = {
  args: {
    platform: 'ios'
  }
}

export const Android: Story = {
  args: {
    platform: 'android'
  }
}

export const iOSDisabled: Story = {
  args: {
    platform: 'ios',
    isDisabled: true,
    disabledContainerStyle,
    disabledToggleStyle
  }
}

export const AndroidDisabled: Story = {
  args: {
    platform: 'android',
    isDisabled: true,
    disabledContainerStyle,
    disabledToggleStyle
  }
}
