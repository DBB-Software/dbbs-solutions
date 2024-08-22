import type { Meta, StoryObj } from '@storybook/react'

import { Fab } from '../index'

const meta: Meta<typeof Fab> = {
  title: 'Fab',
  component: Fab,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' }
    },
    variant: {
      options: ['circular', 'extended'],
      control: { type: 'select' }
    }
  }
}

export default meta
type Story = StoryObj<typeof Fab>

export const Default: Story = {
  args: {},
  render: function Render(args) {
    return <Fab {...args}>+</Fab>
  }
}
export const FabVariantExtended: Story = {
  args: {
    ...Default.args,
    variant: 'extended'
  },
  render: function Render(args) {
    return <Fab {...args}>Text Text</Fab>
  }
}
