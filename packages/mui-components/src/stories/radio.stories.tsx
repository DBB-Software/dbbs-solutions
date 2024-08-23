import type { Meta, StoryObj } from '@storybook/react'
import { Radio } from '../index'

const meta: Meta<typeof Radio> = {
  title: 'Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'medium'],
      control: { type: 'radio' }
    }
  }
}

export default meta
type Story = StoryObj<typeof Radio>

export const Default: Story = {
  args: {
    size: 'small'
  }
}
