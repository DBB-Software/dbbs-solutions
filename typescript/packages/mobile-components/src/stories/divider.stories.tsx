import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Divider, DividerProps } from 'react-native-paper'
import { Dimensions } from 'react-native'

const DEFAULT_ARGS: DividerProps = {
  style: {
    marginTop: Dimensions.get('window').height / 2
  }
}

const meta: Meta<typeof Divider> = {
  title: 'Divider',
  component: Divider,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicBold: Story = {
  args: {
    bold: true
  }
}
export const BasicLeftInset: Story = {
  args: {
    leftInset: true
  }
}
export const BasicHorizontalInset: Story = {
  args: {
    horizontalInset: true
  }
}
