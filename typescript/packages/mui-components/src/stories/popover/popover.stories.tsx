import type { Meta, StoryObj } from '@storybook/react'
import { useState } from '@storybook/preview-api'

import { Button } from '../buttons/Button'
import { Typography } from '../typography/Typography'
import { Popover } from './Popover'

const meta: Meta<typeof Popover> = {
  title: 'Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {}
}
export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  args: {},
  render: function Render() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const handleClose = () => {
      setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    return (
      <div>
        <Button
          aria-describedby={id}
          variant="contained"
          onClick={(event) => {
            setAnchorEl(event.currentTarget)
          }}
        >
          Open Popover
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
        </Popover>
      </div>
    )
  }
}
