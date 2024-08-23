import type { Meta, StoryObj } from '@storybook/react'
import { TextareaAutosize } from '../index'

const meta: Meta<typeof TextareaAutosize> = {
  title: 'TextareaAutosize',
  component: TextareaAutosize,
  tags: ['autodocs'],
  argTypes: {
    maxRows: {
      control: { type: 'number' },
      description: 'Maximum number of rows to display.'
    },
    minRows: {
      control: { type: 'number' },
      description: 'Minimum number of rows to display.'
    }
  }
}
export default meta
type Story = StoryObj<typeof TextareaAutosize>

export const Default: Story = {}
