import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CustomIcon } from '../components/custom-icon'

const meta: Meta<typeof CustomIcon> = {
  title: 'CustomIcon',
  component: CustomIcon,
  args: {
    name: 'main'
  },
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const CustomContent: Story = {
  args: {
    // @ts-expect-error - expected invalid icon
    name: 'invalid-icon'
  }
}
