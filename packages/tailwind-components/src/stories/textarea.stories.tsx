import type { Meta, StoryObj } from '@storybook/react'

import { Textarea } from '../components/textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      defaultValue: false
    },
    value: {
      control: 'text'
    }
  }
}

type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {}
}

export default meta
