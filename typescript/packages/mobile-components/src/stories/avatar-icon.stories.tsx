import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarIconProps } from 'react-native-paper'

const DEFAULT_ARGS: AvatarIconProps = {
  size: 64,
  icon: 'folder'
}

const meta: Meta<typeof Avatar.Icon> = {
  title: 'Avatar/Icon',
  component: Avatar.Icon,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
