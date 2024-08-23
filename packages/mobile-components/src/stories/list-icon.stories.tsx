import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ListIconProps, List } from 'react-native-paper'

const DEFAULT_ARGS: ListIconProps = {
  icon: 'folder'
}

const meta: Meta<typeof List.Icon> = {
  title: 'List/Icon',
  component: List.Icon,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
