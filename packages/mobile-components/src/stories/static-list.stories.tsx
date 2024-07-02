import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CustomButton } from '../components/custom-button'
import { StaticList, StaticListProps } from '../components/static-list'

const listItem = <CustomButton icon={'camera'} text={'TEXT'} onPress={() => console.log('onPress')} />
const DEFAULT_ARGS: StaticListProps = {
  listItems: [
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem
  ]
}

const meta: Meta<typeof StaticList> = {
  title: 'StaticList',
  component: StaticList,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const VerticalDefault: Story = {}
export const HorizontalDefault: Story = {
  args: { isHorizontal: true }
}
export const VerticalWithInteval: Story = {
  args: { interval: 32 }
}
export const HorizontalWithInteval: Story = {
  args: { interval: 32, isHorizontal: true }
}
export const VerticalWithTwoColumns: Story = {
  args: { columns: 2 }
}
export const VerticalWithNColumns: Story = {
  args: { columns: 5 }
}
export const VerticalWithColumnsAndInterval: Story = {
  args: { columns: 2, interval: 32 }
}
