import { Meta, StoryObj } from '@storybook/react'
import { AvatarGroup } from './AvatarGroup'
import { Avatar } from '../avatar/Avatar'
import { Box } from '../box/Box'

const meta: Meta<typeof AvatarGroup> = {
  title: 'AvatarGroup',
  component: AvatarGroup,
  subcomponents: { Avatar },
  tags: ['autodocs'],
  argTypes: {
    total: {
      control: { type: 'number' }
    },
    max: {
      control: { type: 'number' }
    }
  }
}

export default meta
type Story = StoryObj<typeof AvatarGroup>

export const Default: Story = {
  args: {
    variant: 'square',
    max: 4,
    total: 20
  },
  render: function Render(args) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AvatarGroup {...args}>
          <Avatar alt="Remy Sharp" src="https://github.com/shadcn.png" />
          <Avatar alt="Travis Howard" src="https://github.com/shadcn.png" />
          <Avatar alt="Cindy Baker" src="https://github.com/shadcn.png" />
          <Avatar alt="Agnes Walker" src="https://github.com/shadcn.png" />
          <Avatar alt="Trevor Henderson" src="https://github.com/shadcn.png" />
        </AvatarGroup>
      </Box>
    )
  }
}
