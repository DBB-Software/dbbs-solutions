import { Meta, StoryObj } from '@storybook/react'

import { Container, Typography } from '../index'

const meta: Meta<typeof Container> = {
  title: 'Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'false'] },
    fixed: {
      control: { type: 'boolean' }
    }
  }
}

export default meta
type Story = StoryObj<typeof Container>

export const Default: Story = {
  args: {
    maxWidth: 'xs',
    fixed: false
  },
  render: function Render(args) {
    return (
      <Container {...args}>
        <Typography variant="h6">This is a Container component</Typography>
      </Container>
    )
  }
}
