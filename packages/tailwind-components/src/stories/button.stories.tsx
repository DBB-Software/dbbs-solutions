import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../components/button'

const meta: Meta<typeof Button> = {
  title: 'Buttons',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Click me!'
  },
  argTypes: {
    children: {
      control: 'text'
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      defaultValue: 'default'
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      defaultValue: 'default'
    }
  }
}

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {}
}

export default meta
