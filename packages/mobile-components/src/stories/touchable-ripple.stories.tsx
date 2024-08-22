import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TouchableRipple, TouchableRippleProps, Text } from 'react-native-paper'

const DEFAULT_ARGS: TouchableRippleProps = {
  rippleColor: 'rgba(0, 0, 0, .32)',
  onPress: () => console.log('Pressed'),
  children: <Text>Press anywhere</Text>,
  style: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
}

const meta: Meta<typeof TouchableRipple> = {
  title: 'TouchableRipple',
  component: TouchableRipple,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
