import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from '../index'

const meta: Meta<typeof Typography> = {
  title: 'Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'subtitle1',
        'subtitle2',
        'body1',
        'body2',
        'caption',
        'button',
        'overline'
      ],
      control: { type: 'select' },
      description: 'The variant to use.'
    },
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
