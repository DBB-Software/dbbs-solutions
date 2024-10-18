import type { Meta, StoryObj } from '@storybook/react'
import { Alert, AlertTitle } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Alert',
  component: Alert,
  tags: ['autodocs'],
  subcomponents: { AlertTitle },
  argTypes: {
    severity: {
      options: ['success', 'info', 'warning', 'error'],
      control: { type: 'select' }
    },
    variant: {
      options: ['filled', 'outlined'],
      control: { type: 'select' }
    }
  }
}
export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: (args) => <Alert {...args} />
}

export const AlertWithTitle: Story = {
  argTypes: {
    title: {
      control: { type: 'text' }
    }
  },
  args: {
    variant: 'outlined',
    severity: 'success',
    title: 'Success'
  },
  render: function Render(args) {
    const { variant, severity, title } = args
    return (
      <Alert severity={severity} variant={variant}>
        <AlertTitle>{title}</AlertTitle>
      </Alert>
    )
  }
}
