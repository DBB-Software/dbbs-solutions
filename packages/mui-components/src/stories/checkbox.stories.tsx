import { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '../index'

const meta: Meta<typeof Checkbox> = {
  title: 'Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['small', 'medium'] }
  }
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    disabled: false,
    size: 'medium'
  },
  render: function Render(args) {
    return <Checkbox {...args} />
  }
}
