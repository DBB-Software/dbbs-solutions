import type { Meta, StoryObj } from '@storybook/react'

import { Alert, AlertDescription, AlertTitle } from '../components/alert'

const meta: Meta<typeof Alert> = {
  title: 'Alert',
  component: Alert,
  subcomponents: {
    AlertDescription,
    AlertTitle
  },
  tags: ['autodocs'],
  args: {
    variant: 'default'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive']
    }
  }
}

type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: {},
  render: () => (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  )
}

export default meta
