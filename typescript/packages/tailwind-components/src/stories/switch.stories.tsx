import type { Meta, StoryObj } from '@storybook/react'

import { Switch } from '../components/switch'

const meta: Meta<typeof Switch> = {
  title: 'Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      defaultValue: false
    },
    required: {
      control: 'boolean',
      defaultValue: false
    }
  }
}

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {}
}

export default meta
