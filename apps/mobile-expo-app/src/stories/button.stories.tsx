import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { StoriesButton } from '../components/button'

const meta: Meta<typeof StoriesButton> = {
  title: 'StoriesButton',
  component: StoriesButton,
  decorators: [(Story) => <Story />]
}

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export default meta
