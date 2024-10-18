import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    children: { control: { type: 'text' }, description: 'The content of the component.' }
  }
}
export default meta
type Story = StoryObj<typeof Typography>

export const Default: Story = {
  args: {
    variant: 'h1',
    children: 'Typography'
  }
}
