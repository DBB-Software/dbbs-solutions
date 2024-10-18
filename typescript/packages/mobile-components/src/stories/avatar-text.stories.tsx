import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarTextProps } from 'react-native-paper'

const DEFAULT_ARGS: AvatarTextProps = {
  size: 64,
  label: 'AB'
}

const meta: Meta<typeof Avatar.Text> = {
  title: 'Avatar/Text',
  component: Avatar.Text,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
