import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ListSubheaderProps, List } from 'react-native-paper'

const DEFAULT_ARGS: ListSubheaderProps = {
  children: 'My List Title'
}

const meta: Meta<typeof List.Subheader> = {
  title: 'List/Subheader',
  component: List.Subheader,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
