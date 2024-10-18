import type { Meta, StoryObj } from '@storybook/react'

import { Fab } from './Fab'

const meta: Meta<typeof Fab> = {
  title: 'Fab',
  component: Fab,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Fab>

export const Default: Story = {
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
