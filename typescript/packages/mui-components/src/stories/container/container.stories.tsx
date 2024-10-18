import { Meta, StoryObj } from '@storybook/react'

import { Container } from './Container'
import { Typography } from '../typography/Typography'

const meta: Meta<typeof Container> = {
  title: 'Container',
  component: Container,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Container>

export const Default: Story = {
  render: function Render(args) {
    return (
      <Container {...args}>
        <Typography variant="h6">This is a Container component</Typography>
      </Container>
    )
  }
}
