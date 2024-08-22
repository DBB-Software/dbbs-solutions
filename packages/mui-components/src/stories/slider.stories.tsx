import type { Meta, StoryObj } from '@storybook/react'

import { Slider } from '../index'

const meta: Meta<typeof Slider> = {
  title: 'Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: { type: 'number' },
      description: 'The default value of the slider'
    },
    min: {
      control: { type: 'number' },
      description: 'The minimum value of the slider'
    },
    max: {
      control: { type: 'number' },
      description: 'The maximum value of the slider'
    },
    step: {
      control: { type: 'number' },
      description: 'The step value of the slider'
    },
    marks: {
      control: { type: 'object' },
      description: 'Marks of the slider'
    },
    valueLabelDisplay: {
      control: { type: 'select' },
      options: ['on', 'off', 'auto'],
      description: 'The display of the value label'
    },

    disabled: {
      control: { type: 'boolean' },
      description: 'If `true`, the slider will be disabled'
    }
  },
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    marks: [
      { value: 0, label: '0' },
      { value: 100, label: '100' }
    ],
    valueLabelDisplay: 'auto',
    disabled: false
  }
}
export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  args: {}
}
