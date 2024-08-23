import type { Meta, StoryObj } from '@storybook/react'
import { Paper } from '../index'

const meta: Meta<typeof Paper> = {
  title: 'Paper',
  component: Paper,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['elevation', 'outlined'],
      description: 'The variant to use'
    },
    elevation: {
      control: { type: 'number' },
      description: 'Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.'
    },
    square: {
      control: { type: 'boolean' },
      description: 'If true, rounded corners are disabled.'
    }
  }
}
export default meta
type Story = StoryObj<typeof Paper>

export const Default: Story = {
  args: {
    variant: 'elevation',
    elevation: 1,
    children: 'Paper',
    square: false
  }
}
