import type { Meta, StoryObj } from '@storybook/react'
import { useState } from '@storybook/preview-api'
import { Button } from '../buttons/Button'
import { Box } from '../box/Box'
import { Popper } from './Popper'

const meta: Meta<typeof Popper> = {
  title: 'Popper',
  component: Popper,
  tags: ['autodocs'],
  argTypes: {}
}
export default meta
type Story = StoryObj<typeof Popper>

export const Default: Story = {
  render: function Render() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
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
          Open Popper
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>The content of the Popper.</Box>
        </Popper>
      </div>
    )
  }
}
