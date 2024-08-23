import type { Meta, StoryObj } from '@storybook/react'
import { useState } from '@storybook/preview-api'

import { Button, Drawer } from '../index'

const meta: Meta<typeof Drawer> = {
  title: 'Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    anchor: {
      options: ['top', 'left', 'bottom', 'right'],
      control: { type: 'select' }
    }
  }
}
export default meta
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  args: {},
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    const { anchor } = args
    const handleClick = () => {
      setOpen(!open)
    }
    return (
      <>
        <Button onClick={handleClick}>Open drawer</Button>
        <Drawer anchor={anchor} open={open}>
          <Button onClick={handleClick}>Close drawer</Button>
        </Drawer>
      </>
    )
  }
}
