import { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { Backdrop, Button, CircularProgress } from '../index'

const meta: Meta<typeof Backdrop> = {
  title: 'Backdrop',
  component: Backdrop,
  subcomponents: { Button, CircularProgress },
  tags: ['autodocs'],
  argTypes: {}
}
export default meta

type Story = StoryObj<typeof Backdrop>

export const Default: Story = {
  render: function Render() {
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
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    )
  }
}
