import type { Meta, StoryObj } from '@storybook/react'

import { ComponentType } from 'react'
import { AppBar } from './AppBar'
import { Toolbar } from './ToolBar'
import { Typography } from '../typography/Typography'
import { Button, IconButton } from '../buttons/Button'

const meta: Meta<typeof AppBar> = {
  title: 'AppBar',
  component: AppBar,
  subcomponents: {
    Toolbar: Toolbar as ComponentType<unknown>,
    IconButton: IconButton as ComponentType<unknown>,
    Typography: Typography as ComponentType<unknown>,
    Button: Button as ComponentType<unknown>
  },
  tags: ['autodocs']
}
export default meta

type Story = StoryObj<typeof AppBar>

export const Default: Story = {
  render: (args) => (
    <>
      <AppBar position="static" {...args}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            x
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </>
  )
}
