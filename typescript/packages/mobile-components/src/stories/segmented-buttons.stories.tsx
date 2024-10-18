import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SegmentedButtons } from 'react-native-paper'
import { SafeAreaView } from 'react-native'

const meta: Meta<typeof SegmentedButtons> = {
  title: 'SegmentedButtons',
  component: SegmentedButtons,
  decorators: [
    (Story) => {
      const [value, setValue] = React.useState('')
      return (
        <SafeAreaView>
          <Story
            args={{
              buttons: [
                {
                  value: 'walk',
                  label: 'Walking'
                },
                {
                  value: 'train',
                  label: 'Transit'
                },
                { value: 'drive', label: 'Driving' }
              ],
              value,
              onValueChange: setValue
            }}
          />
        </SafeAreaView>
      )
    }
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
