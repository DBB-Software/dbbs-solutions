import type { Meta, StoryObj } from '@storybook/react'

import { Progress } from '../components/progress'

const meta: Meta<typeof Progress> = {
  title: 'Progress',
  component: Progress,
  tags: ['autodocs'],
  args: {
    value: 20,
    max: 100
  },
  argTypes: {
    value: {
      control: 'number'
    },
    max: {
      control: 'number'
    }
  }
}

type Story = StoryObj<typeof Progress>

export const Default: Story = {}

export const WithLabel: Story = {
  render: (args) => <Progress {...args} getValueLabel={(value, max) => `${value} out of ${max}`} />
}

export default meta
