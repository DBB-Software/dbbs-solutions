import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from '../components/checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Checkboxes',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    children: 'Badge'
  },
  argTypes: {
    checked: {
      control: 'boolean'
    }
  }
}

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {}
}

export default meta
