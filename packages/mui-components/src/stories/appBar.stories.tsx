import type { Meta, StoryObj } from '@storybook/react'

import { AppBar, Toolbar, AppBarProps, IconButton, Typography, Button } from '../index'

const meta: Meta<AppBarProps> = {
  title: 'AppBar',
  component: AppBar,
  subcomponents: { Toolbar, IconButton, Typography, Button },
  args: {},
  argTypes: {},
  tags: ['autodocs']
}
export default meta

type Story = StoryObj<AppBarProps>

export const Default: Story = {
  args: {},
  render: () => (
    <>
      <AppBar position="static">
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
