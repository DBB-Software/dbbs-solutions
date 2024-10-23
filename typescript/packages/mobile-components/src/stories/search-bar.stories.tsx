import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Searchbar, SearchbarProps } from 'react-native-paper'

const DEFAULT_ARGS: SearchbarProps = {
  value: 'search',
  placeholder: 'placeholder',
  onChangeText: () => console.log('onChangeText')
}

const meta: Meta<typeof Searchbar> = {
  title: 'Searchbar',
  component: Searchbar,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicLoading: Story = {
  args: { loading: true }
}
export const View: Story = {
  args: { mode: 'view' }
}
