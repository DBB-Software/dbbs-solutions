import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from '../index'

const meta: Meta<typeof Pagination> = {
  title: 'Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number' }
    },
    variant: {
      control: { type: 'select' },
      options: ['text', 'outlined']
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    }
  }
}
export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  args: {
    count: 10,
    variant: 'text',
    size: 'medium'
  }
}
