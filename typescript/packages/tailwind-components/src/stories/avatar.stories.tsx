import type { Meta, StoryObj } from '@storybook/react'

import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Avatar',
  component: Avatar,
  subcomponents: {
    AvatarFallback,
    AvatarImage
  },
  tags: ['autodocs']
}

type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {},
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}

export default meta
