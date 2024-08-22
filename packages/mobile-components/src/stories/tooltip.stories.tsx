import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TooltipProps, Tooltip, IconButton, Provider } from 'react-native-paper'

const DEFAULT_ARGS: TooltipProps = {
  title: 'Selected Camera',
  children: <IconButton icon="camera" selected size={24} onPress={() => {}} />
}

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
  args: DEFAULT_ARGS,
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    )
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
