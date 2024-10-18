import { Meta, StoryObj } from '@storybook/react'
import { ButtonGroup } from './ButtonGroup'
import { Button } from '../buttons/Button'

const meta: Meta<typeof ButtonGroup> = {
  title: 'ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['contained', 'outlined', 'text'],
      control: { type: 'select' }
    }
  }
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  args: {
    variant: 'contained'
  },
  render: function Render(args) {
    return (
      <ButtonGroup {...args}>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    )
  }
}
