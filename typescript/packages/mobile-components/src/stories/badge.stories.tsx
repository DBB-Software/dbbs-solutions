import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Badge, BadgeProps } from 'react-native-paper'

const DEFAULT_ARGS: BadgeProps = {
  children: 3
}

const meta: Meta<typeof Badge> = {
  title: 'Badge',
  component: Badge,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
