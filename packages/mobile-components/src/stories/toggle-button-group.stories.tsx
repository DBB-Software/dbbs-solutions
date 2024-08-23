import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ToggleButton } from 'react-native-paper'

const meta: Meta<typeof ToggleButton.Group> = {
  title: 'Toggle/ButtonGroup',
  component: ToggleButton.Group,
  decorators: [
    (Story) => {
      const [value, setValue] = React.useState('left')

      return (
        <Story
          args={{
            value,
            onValueChange: setValue,
            children: (
              <>
                <ToggleButton icon="format-align-left" value="left" />
                <ToggleButton icon="format-align-right" value="right" />
              </>
            )
          }}
        />
      )
    }
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
