import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { StyleSheet } from 'react-native'
import { Surface, SurfaceProps, Text } from 'react-native-paper'

const styles = StyleSheet.create({
  surface: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
    margin: 24,
    padding: 8,
    width: 80
  }
})
const DEFAULT_ARGS: Partial<SurfaceProps> = {
  style: styles.surface
}

const meta: Meta<typeof Surface> = {
  title: 'Surface',
  component: Surface,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: { children: <Text>Surface</Text>, elevation: 1 }
}
export const BasicElevation4: Story = {
  args: { children: <Text>Surface</Text>, elevation: 4 }
}
export const BasicFlat: Story = {
  args: { children: <Text>Surface</Text>, elevation: 1, mode: 'flat' }
}
export const BasicFlatElevation4: Story = {
  args: { children: <Text>Surface</Text>, elevation: 4, mode: 'flat' }
}
