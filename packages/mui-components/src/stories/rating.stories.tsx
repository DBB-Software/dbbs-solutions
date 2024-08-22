import type { Meta, StoryObj } from '@storybook/react'
import { Rating } from '../index'

const meta: Meta<typeof Rating> = {
  title: 'Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {}
}
export default meta
type Story = StoryObj<typeof Rating>

export const Default: Story = {
  args: {}
}
