import type { Meta, StoryObj } from '@storybook/react'

import { Skeleton } from '../index'

const meta: Meta<typeof Skeleton> = {
  title: 'Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'rectangular', 'circular', 'rounded'],
      description: 'Variant of the skeleton'
    },
    animation: {
      control: { type: 'select' },
      options: ['wave', 'pulse'],
      description: 'Animation of the skeleton'
    },
    width: {
      control: { type: 'number' },
      description: 'Width of the skeleton'
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the skeleton'
    }
  },
  args: {
    variant: 'text',
    animation: 'wave',
    width: 200,
    height: 20
  }
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {}
