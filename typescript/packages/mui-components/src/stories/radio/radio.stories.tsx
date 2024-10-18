import type { Meta, StoryObj } from '@storybook/react'
import { Radio } from './Radio'

const meta: Meta<typeof Radio> = {
  title: 'Radio',
  component: Radio,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Radio>

export const Default: Story = {}
