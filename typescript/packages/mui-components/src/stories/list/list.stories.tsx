import type { Meta, StoryObj } from '@storybook/react'
import { List, ListItem, ListItemButton, ListSubheader, ListItemText, ListItemAvatar } from './list'
import { Avatar } from '../avatar/Avatar'

const meta: Meta<typeof List> = {
  title: 'List',
  component: List,
  tags: ['autodocs']
}
export default meta
type Story = StoryObj<typeof List>

export const Default: Story = {
  render: (args) => (
    <List
      {...args}
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }
    >
      <ListItemButton>
        <ListItemText primary="Sent mail" />
      </ListItemButton>
      <ListItemButton>
        <ListItemText primary="Drafts" />
      </ListItemButton>
      <ListItem>
        <ListItemAvatar>
          <Avatar>TS</Avatar>
        </ListItemAvatar>
        <ListItemText primary="Avatar" />
      </ListItem>
    </List>
  )
}
