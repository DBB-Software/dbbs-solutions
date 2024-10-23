import React from 'react'
import { Text, TextInput, View, StyleSheet } from 'react-native'
import type { Meta, StoryObj } from '@storybook/react'
import { MD3Colors } from 'react-native-paper'
import { KeyboardView } from '../components/keyboard-avoiding-view'

const styles = StyleSheet.create({
  absoluteWrapper: {
    alignItems: 'center',
    borderColor: MD3Colors.primary10,
    borderRadius: 12,
    borderWidth: 1,
    bottom: 100,
    justifyContent: 'center',
    padding: 16,
    position: 'absolute'
  },
  input: {
    borderColor: MD3Colors.primary10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    width: '100%'
  },
  wrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16
  }
})

const meta: Meta<typeof KeyboardView> = {
  title: 'KeyboardView',
  component: KeyboardView,
  args: {
    children: (
      <View style={styles.wrapper}>
        <Text>Hello Relative!</Text>
        <TextInput style={styles.input} placeholder="TextInput" />
        <View style={styles.absoluteWrapper}>
          <Text>Hello Absolute!</Text>
        </View>
      </View>
    )
  },
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicDisabled: Story = {
  args: { enabled: false }
}
export const BehaviorPadding: Story = {
  args: { behavior: 'padding' }
}
export const BehaviorHeight: Story = {
  args: { behavior: 'height' }
}
export const BehaviorPosition: Story = {
  args: { behavior: 'position' }
}
