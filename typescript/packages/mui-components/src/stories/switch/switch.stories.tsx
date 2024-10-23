import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Switch',
  component: Switch,
  tags: ['Switch']
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    size: 'medium'
  }
}
