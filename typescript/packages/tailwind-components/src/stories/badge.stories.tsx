import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from '../components/badge'

const meta: Meta<typeof Badge> = {
  title: 'Badges',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Badge'
  },
  argTypes: {
    children: {
      control: 'text'
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'secondary', 'outline'],
      defaultValue: 'default'
    }
  }
}

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {}
}

export default meta
