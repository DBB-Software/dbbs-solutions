import type { Meta, StoryObj } from '@storybook/react'

import { Slider } from '../components/slider'

const meta: Meta<typeof Slider> = {
  title: 'Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text'
    },
    disabled: {
      control: 'boolean',
      defaultValue: false
    },
    dir: {
      control: 'select',
      options: ['ltr', 'rtl'],
      defaultValue: 'ltr'
    },
    min: {
      control: 'number',
      defaultValue: 0
    },
    max: {
      control: 'number',
      defaultValue: 100
    },
    step: {
      control: 'number',
      defaultValue: 2
    },
    minStepsBetweenThumbs: {
      control: 'number'
    },
    value: {
      control: 'array',
      defaultValue: Array(100)
        .fill(null)
        .map((_, i) => i + 1)
    },
    defaultValue: {
      control: 'array'
    }
  }
}

type Story = StoryObj<typeof Slider>

export const Default: Story = {
  args: {}
}

export default meta
