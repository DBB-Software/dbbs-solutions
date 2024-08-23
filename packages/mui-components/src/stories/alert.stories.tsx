import type { Meta, StoryObj } from '@storybook/react'
import { Alert, AlertProps, AlertTitle } from '../index'

const meta: Meta<AlertProps> = {
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
type Story = StoryObj<AlertProps>

export const Default: Story = {
  args: {
    children: 'This is a success',
    variant: 'outlined',
    severity: 'success'
  }
}

export const AlertWithTitle: Story = {
  argTypes: {
    title: {
      control: { type: 'text' }
    },
    subTitle: {
      control: { type: 'text' }
    }
  },
  args: {
    variant: 'outlined',
    severity: 'success',
    title: 'Success',
    subTitle: 'This is a success alert — check it out!'
  },
  render: function Render(args) {
    const { variant, severity, title, subTitle } = args
    return (
      <Alert severity={severity} variant={variant}>
        <AlertTitle>{title}</AlertTitle>
        {subTitle}
      </Alert>
    )
  }
}
