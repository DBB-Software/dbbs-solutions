import type { Meta, StoryObj } from '@storybook/react'
import { Chip, Avatar } from '../index'

const meta: Meta<typeof Chip> = {
  title: 'Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['outlined', 'filled'],
      control: { type: 'select' }
    },
    label: {
      control: { type: 'text' }
    },
    size: {
      options: ['small', 'medium'],
      control: { type: 'select' }
    }
  }
}
export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: {
    label: 'chip label',
    variant: 'outlined',
    size: 'medium'
  }
}
export const ChipWithAvatar: Story = {
  args: {
    ...Default.args,
    avatar: <Avatar>M</Avatar>
  }
}
