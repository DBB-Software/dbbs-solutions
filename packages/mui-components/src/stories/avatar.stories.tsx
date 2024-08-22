import { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '../index'

const meta: Meta<typeof Avatar> = {
  title: 'Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['square', 'rounded', 'circular'],
      control: { type: 'select' }
    }
  }
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    variant: 'square'
  },
  render: function Render(args) {
    const { variant } = args
    return <Avatar alt="MUI Avatar" src="https://github.com/shadcn.png" variant={variant} />
  }
}
export const LetterAvatar: Story = {
  ...Default.args,

  render: function Render(args) {
    const { variant } = args
    return <Avatar variant={variant}>MS</Avatar>
  }
}
