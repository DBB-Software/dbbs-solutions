import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ToggleButton, ToggleButtonProps } from 'react-native-paper'

const DEFAULT_ARGS: ToggleButtonProps = {
  icon: 'bluetooth',
  value: 'bluetooth'
}

const meta: Meta<typeof ToggleButton> = {
  title: 'Toggle/Button',
  component: ToggleButton,
  args: DEFAULT_ARGS,
  decorators: [
    (Story, context) => {
      const [status, setStatus] = React.useState<'checked' | 'unchecked'>('checked')

      const onButtonToggle = () => {
        setStatus(status === 'checked' ? 'unchecked' : 'checked')
      }

      return (
        <Story
          args={{
            ...context.args,
            status,
            onPress: onButtonToggle
          }}
        />
      )
    }
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
