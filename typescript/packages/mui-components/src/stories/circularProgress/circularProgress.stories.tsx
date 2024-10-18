import type { Meta, StoryObj } from '@storybook/react'
import { CircularProgress } from './CircularProgress'

const meta: Meta<typeof CircularProgress> = {
  title: 'CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
  argTypes: {}
}
export default meta
type Story = StoryObj<typeof CircularProgress>

export const Default: Story = {
  args: {}
}
