import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ListItemProps, List } from 'react-native-paper'

const DEFAULT_ARGS: ListItemProps = {
  title: 'item',
  description: 'Item description',
  left: (props) => <List.Icon {...props} icon="folder" />
}

const meta: Meta<typeof List.Item> = {
  title: 'List/Item',
  component: List.Item,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
