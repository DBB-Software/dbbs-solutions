import type { Meta, StoryObj } from '@storybook/react'

import { Skeleton } from '../components/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Skeleton',
  component: Skeleton,
  tags: ['autodocs']
}

type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  args: {}
}

export default meta
