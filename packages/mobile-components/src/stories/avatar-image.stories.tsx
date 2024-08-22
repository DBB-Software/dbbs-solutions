import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImageProps } from 'react-native-paper'

const DEFAULT_ARGS: AvatarImageProps = {
  size: 64,
  source: {
    uri: 'https://www.w3schools.com/w3images/avatar2.png'
  }
}

const meta: Meta<typeof Avatar.Image> = {
  title: 'Avatar/Image',
  component: Avatar.Image,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
