import type { Meta, StoryObj } from '@storybook/react'
import { useState } from '@storybook/preview-api'
import { SpeedDial, Box, Backdrop, SpeedDialAction } from '../index'

const meta: Meta<typeof SpeedDial> = {
  title: 'SpeedDial',
  component: SpeedDial,
  tags: ['autodocs'],
  argTypes: {}
}
export default meta
type Story = StoryObj<typeof SpeedDial>

export const Default: Story = {
  args: {},
  render: function Render() {
    const actions = [{ name: 'Copy' }, { name: 'Save' }, { name: 'Print' }, { name: 'Share' }]
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
      <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <Backdrop open={open} />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction key={action.name} tooltipTitle={action.name} tooltipOpen onClick={handleClose} />
          ))}
        </SpeedDial>
      </Box>
    )
  }
}
