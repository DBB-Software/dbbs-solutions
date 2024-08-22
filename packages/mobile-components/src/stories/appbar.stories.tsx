import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Appbar } from 'react-native-paper'
import { Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

const meta: Meta<typeof Appbar> = {
  title: 'Appbar',
  component: Appbar.Header,
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    )
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Action: Story = {
  args: {
    children: (
      <>
        <Appbar.Content title="Title" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
      </>
    )
  }
}
export const BackAction: Story = {
  args: {
    children: <Appbar.BackAction onPress={() => {}} />
  }
}
export const Content: Story = {
  args: {
    children: <Appbar.Content title="Title" />
  }
}
export const Header: Story = {
  args: {
    children: (
      <>
        <Appbar.BackAction onPress={() => console.log('Went back')} />
        <Appbar.Content title="Title" />
        <Appbar.Action icon="magnify" onPress={() => console.log('Searching')} />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('Shown more')} />
      </>
    )
  }
}
