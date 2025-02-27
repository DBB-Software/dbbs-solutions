import { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { Backdrop } from './Backdrop'
import { Button } from '../buttons/Button'
import { CircularProgress } from '../circularProgress/CircularProgress'

const meta: Meta<typeof Backdrop> = {
  title: 'Backdrop',
  component: Backdrop,
  tags: ['autodocs'],
  argTypes: {}
}
export default meta

type Story = StoryObj<typeof Backdrop>

export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    const handleClose = () => {
      setOpen(false)
    }
    const handleOpen = () => {
      setOpen(true)
    }
    return (
      <div>
        <Button onClick={handleOpen}>Show backdrop</Button>
        <Backdrop
          {...args}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    )
  }
}
