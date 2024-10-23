import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from '@storybook/preview-api'

import { Drawer } from './Drawer'
import { Button } from '../buttons/Button'

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
  args: {
    onTransitionEnter: fn()
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    const handleClick = () => {
      setOpen(!open)
    }
    return (
      <>
        <Button onClick={handleClick}>Open drawer</Button>
        <Drawer {...args} open={open}>
          <Button onClick={handleClick}>Close drawer</Button>
        </Drawer>
      </>
    )
  }
}
