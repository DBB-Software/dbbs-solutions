import { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'
import { Avatar } from '../avatar/Avatar'

const meta: Meta<typeof Badge> = {
  title: 'Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['dot', 'standard'],
      control: { type: 'select' }
    },
    badgeContent: {
      control: { type: 'text' }
    }
  }
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    variant: 'standard',
    badgeContent: '1'
  },
  render: function Render(args) {
    const { variant, badgeContent } = args
    return (
      <Badge variant={variant} badgeContent={badgeContent} color="secondary">
        <Avatar alt="MUI Avatar" src="https://github.com/shadcn.png" />
      </Badge>
    )
  }
}
