import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from './TextField'

const meta: Meta<typeof TextField> = {
  title: 'TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['standard', 'outlined', 'filled'],
      control: { type: 'select' },
      description: 'The variant to use.'
    },
    size: {
      options: ['small', 'medium'],
      control: { type: 'select' },
      description: 'The size of the text field.'
    },
    label: { control: { type: 'text' }, description: 'The label of the text field.' },
    required: { control: { type: 'boolean' }, description: 'If true, the label is displayed as required.' },
    disabled: { control: { type: 'boolean' }, description: 'If true, the text field is disabled.' },
    helperText: { control: { type: 'text' }, description: 'The helper text of the text field.' },
    type: {
      control: { type: 'select' },
      options: [
        'text',
        'password',
        'email',
        'number',
        'search',
        'tel',
        'url',
        'date',
        'time',
        'datetime-local',
        'month',
        'week',
        'color'
      ],
      description: 'The type of the text field.'
    }
  },
  args: {
    variant: 'standard',
    size: 'medium',
    label: 'Label',
    required: false,
    disabled: false,
    helperText: 'Helper text',
    type: 'text'
  }
}
export default meta
type Story = StoryObj<typeof TextField>

export const Default: Story = {}
