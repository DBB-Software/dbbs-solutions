import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Drawer, DrawerCollapsedItemProps } from 'react-native-paper'

const DEFAULT_ARGS: DrawerCollapsedItemProps = {
  focusedIcon: 'inbox',
  unfocusedIcon: 'inbox-outline',
  label: 'Inbox'
}

const meta: Meta<typeof Drawer.CollapsedItem> = {
  title: 'Drawer/CollapsedItem',
  component: Drawer.CollapsedItem,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
