import type { Meta, StoryObj } from '@storybook/react'
import { useState } from '@storybook/preview-api'
import { Modal } from './Modal'
import { Button } from '../buttons/Button'
import { Box } from '../box/Box'
import { Typography } from '../typography/Typography'

const meta: Meta<typeof Modal> = {
  title: 'Modal',
  component: Modal,
  tags: ['autodocs']
}
export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false)

    const handleClick = () => {
      setOpen(!open)
    }

    const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      pt: 2,
      px: 4,
      pb: 3
    }

    return (
      <>
        <Button onClick={handleClick}>Open modal</Button>
        <Modal
          open={open}
          onClose={handleClick}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
      </>
    )
  }
}
