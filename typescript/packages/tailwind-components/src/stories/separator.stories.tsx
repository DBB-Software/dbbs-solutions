import type { Meta, StoryObj } from '@storybook/react'

import { Separator } from '../components/separator'

const meta: Meta<typeof Separator> = {
  title: 'Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal'
    },
    decorative: {
      control: 'boolean',
      defaultValue: false
    }
  }
}

type Story = StoryObj<typeof Separator>

export const Default: Story = {
  args: {}
}

export default meta
