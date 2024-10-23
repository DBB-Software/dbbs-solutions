import type { Meta, StoryObj } from '@storybook/react'

import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Skeleton',
  component: Skeleton,
  tags: ['autodocs'],

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
