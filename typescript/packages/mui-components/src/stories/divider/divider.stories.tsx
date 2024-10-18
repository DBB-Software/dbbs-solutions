import { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'Divider',
  component: Divider,

  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Divider>

export const Default: Story = {
  args: {
    variant: 'fullWidth',
    light: false,
    orientation: 'horizontal',
    textAlign: 'center'
  }
}

export const DividerWithText: Story = {
  render: function Render(args) {
    return <Divider {...args}>Text</Divider>
  }
}
