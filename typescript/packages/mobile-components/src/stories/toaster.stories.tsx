import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Provider, Button, Text } from 'react-native-paper'
import { Toaster, ToasterProps } from '../components/toaster'
import { useToast } from '../components/toaster/core/useToast'

const DEFAULT_ARGS: ToasterProps = {
  toastOptions: {
    duration: 3000,
    position: 'top'
  },
  containerStyle: {
    marginTop: 20
  }
}

const meta: Meta<typeof Toaster> = {
  title: 'Toaster',
  component: Toaster,
  args: DEFAULT_ARGS,
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    )
  ]
}

export default meta

type Story = StoryObj<typeof meta>

const ToasterStory: React.FC<ToasterProps> = (args) => {
  const { success, error, blank } = useToast()

  return (
    <>
      <Toaster {...args} />
      <Button onPress={() => success('This is a success toast!')}>
        <Text>Show Success Toast</Text>
      </Button>
      <Button onPress={() => error('This is a error toast!')}>
        <Text>Show Error Toast</Text>
      </Button>
      <Button onPress={() => blank('This is a blank toast!')}>
        <Text>Show Blank Toast</Text>
      </Button>
    </>
  )
}

export const Basic: Story = {
  render: (args) => <ToasterStory {...args} />
}
