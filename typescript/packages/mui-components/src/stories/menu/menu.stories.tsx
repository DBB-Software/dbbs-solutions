import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../buttons/Button'
import { Menu, MenuItem } from './Menu'

const meta: Meta<typeof Menu> = {
  title: 'Menu',
  component: Menu,
  tags: ['autodocs']
}
export default meta
type Story = StoryObj<typeof Menu>

export const Default: Story = {
  render: function Render() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }
    return (
      <div>
        <Button onClick={handleClick}>Dashboard</Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </div>
    )
  }
}
