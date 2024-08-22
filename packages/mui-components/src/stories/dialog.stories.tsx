import type { Meta, StoryObj } from '@storybook/react'
import { useState } from '@storybook/preview-api'

import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '../index'

const meta: Meta<typeof Dialog> = {
  title: 'Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {}
}
export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {},
  render: function Render() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button
          variant="outlined"
          onClick={() => {
            setOpen(true)
          }}
        >
          Open alert dialog
        </Button>
        <Dialog open={open}>
          <DialogTitle>Use Google&apos;s location service?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Let Google help apps determine location. This means sending anonymous location data to Google, even when
              no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false)
              }}
            >
              Disagree
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
              }}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}
