import type { Meta, StoryObj } from '@storybook/react'
import { Button, ButtonProps } from '../index'

const meta: Meta<ButtonProps> = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['contained', 'outlined', 'text'],
      control: { type: 'select' }
    },
    disabled: {
      control: { type: 'boolean' }
    }
  }
}
export default meta
type Story = StoryObj<ButtonProps>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'outlined'
  }
}
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true
  }
}
