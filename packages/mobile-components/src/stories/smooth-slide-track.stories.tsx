import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import type { Meta, StoryObj } from '@storybook/react'
import { SmoothSlideTrack } from '../components/smooth-slide-track'

const data = ['Item 1', 'Item 2', 'Item 3']
const itemWidth = 300

const meta: Meta<typeof SmoothSlideTrack> = {
  title: 'SmoothSlideTrack',
  component: SmoothSlideTrack,
  args: {
    data,
    itemWidth,
    renderItem: (item) => (
      <View style={styles.item}>
        <Text>{String(item)}</Text>
      </View>
    )
  },
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

const styles = StyleSheet.create({
  item: {
    height: 100,
    width: 300
  }
})
