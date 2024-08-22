import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '../index'

const meta: Meta<typeof Switch> = {
  title: 'Switch',
  component: Switch,
  tags: ['Switch'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
      description: 'The size of the switch'
    }
  }
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    size: 'medium'
  }
}
