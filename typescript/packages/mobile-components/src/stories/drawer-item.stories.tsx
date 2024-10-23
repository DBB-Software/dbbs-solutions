import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Drawer, DrawerItemProps } from 'react-native-paper'

const DEFAULT_ARGS: DrawerItemProps = {
  icon: 'inbox',
  label: 'Inbox',
  style: { backgroundColor: '#64ffda', marginTop: 24 }
}

const meta: Meta<typeof Drawer.Item> = {
  title: 'Drawer/Item',
  component: Drawer.Item,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
