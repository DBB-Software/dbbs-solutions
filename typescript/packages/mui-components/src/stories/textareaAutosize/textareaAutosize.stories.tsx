import type { Meta, StoryObj } from '@storybook/react'
import { TextareaAutosize } from './TextareaAutosize'

const meta: Meta<typeof TextareaAutosize> = {
  title: 'TextareaAutosize',
  component: TextareaAutosize,
  tags: ['autodocs']
}
export default meta
type Story = StoryObj<typeof TextareaAutosize>

export const Default: Story = {}
