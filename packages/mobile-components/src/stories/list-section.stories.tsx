import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ListSectionProps, List, Text } from 'react-native-paper'

const DEFAULT_ARGS: ListSectionProps = {
  children: (
    <>
      <List.Subheader>
        <Text>Some title</Text>
      </List.Subheader>
      <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
      <List.Item title="Second Item" left={() => <List.Icon icon="folder" />} />
    </>
  )
}

const meta: Meta<typeof List.Section> = {
  title: 'List/Section',
  component: List.Section,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
