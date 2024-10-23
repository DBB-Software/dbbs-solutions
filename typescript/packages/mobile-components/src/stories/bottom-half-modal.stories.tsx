import React, { useState } from 'react'
import { Text, View } from 'react-native'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from 'react-native-paper'
import { BottomHalfModal } from '../components/bottom-half-modal'

const meta: Meta<typeof BottomHalfModal> = {
  title: 'BottomHalfModal',
  component: BottomHalfModal,
  args: {
    isOpen: false,
    onClose: () => {},
    children: <Text>Bottom Half Modal</Text>
  },
  decorators: [
    (Story) => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <View>
          <Button onPress={() => setIsOpen(!isOpen)}>
            <Text>Toggle Modal</Text>
          </Button>
          <Story args={{ isOpen, onClose: () => setIsOpen(false) }} />
        </View>
      )
    }
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
