import { Meta, StoryObj } from '@storybook/react'
import { Divider } from '../index'

const meta: Meta<typeof Divider> = {
  title: 'Divider',
  component: Divider,

  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['fullWidth', 'inset', 'middle'],
      control: { type: 'select' }
    },
    light: {
      control: { type: 'boolean' }
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' }
    },
    textAlign: {
      options: ['center', 'left', 'right'],
      control: { type: 'select' }
    }
  }
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
  args: {
    ...Default.args
  },
  render: function Render(args) {
    return <Divider {...args}>Text</Divider>
  }
}
