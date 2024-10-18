import { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

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
  render: function Render(args) {
    return <Checkbox {...args} />
  }
}
