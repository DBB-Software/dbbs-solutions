import type { Meta, StoryObj } from '@storybook/react'

import { Input } from '../components/input'

const meta: Meta<typeof Input> = {
  title: 'Inputs',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'text',
      defaultValue: 'text'
    },
    disabled: {
      control: 'boolean',
      defaultValue: false
    },
    placeholder: {
      control: 'text'
    },
    value: {
      control: 'text'
    }
  }
}

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {}
}

export default meta
