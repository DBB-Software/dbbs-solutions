import type { Meta, StoryObj } from '@storybook/react'

import { Label } from '../components/label'

const meta: Meta<typeof Label> = {
  title: 'Labels',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      defaultValue: 'Label'
    }
  }
}

type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: {}
}

export default meta
