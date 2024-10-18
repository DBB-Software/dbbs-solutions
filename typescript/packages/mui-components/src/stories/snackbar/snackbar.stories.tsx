import { SyntheticEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from '@storybook/preview-api'

import { Snackbar, SnackbarContent } from './Snackbar'
import { Button } from '../buttons/Button'

const meta: Meta<typeof Snackbar> = {
  title: 'Snackbar',
  component: Snackbar,
  tags: ['autodocs']
}
export default meta
type Story = StoryObj<typeof Snackbar>

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false)

    const handleClick = () => {
      setOpen(true)
    }

    const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }

      setOpen(false)
    }

    const action = (
      <>
        <Button color="secondary" size="small" onClick={handleClose}>
          UNDO
        </Button>
        <Button color="secondary" size="small" onClick={handleClose}>
          close
        </Button>
      </>
    )

    return (
      <div>
        <Button onClick={handleClick}>Open Snackbar</Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} action={action}>
          <div>
            <SnackbarContent message="I love snacks." action={action} />
          </div>
        </Snackbar>
      </div>
    )
  }
}
