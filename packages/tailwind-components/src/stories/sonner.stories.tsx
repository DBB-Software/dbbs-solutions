import type { Meta, StoryObj } from '@storybook/react'

import { SonnerToaster } from '../components/sonner'

const meta: Meta<typeof SonnerToaster> = {
  title: 'Sonner',
  component: SonnerToaster,
  tags: ['autodocs'],
  argTypes: {
    invert: {
      control: 'boolean',
      defaultValue: false
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      defaultValue: 'system'
    },
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'],
      defaultValue: 'top-left'
    },
    hotkey: {
      control: 'array'
    },
    richColors: {
      control: 'boolean',
      defaultValue: false
    },
    expand: {
      control: 'boolean',
      defaultValue: false
    },
    duration: {
      control: 'number',
      defaultValue: 600
    },
    gap: {
      control: 'number',
      defaultValue: 1
    },
    visibleToasts: {
      control: 'number',
      defaultValue: 1
    },
    closeButton: {
      control: 'boolean',
      defaultValue: true
    },
    pauseWhenPageIsHidden: {
      control: 'boolean',
      defaultValue: false
    },
    dir: {
      control: 'select',
      options: ['rtl', 'ltr', 'auto'],
      defaultValue: 'ltr'
    }
  }
}

type Story = StoryObj<typeof SonnerToaster>

export const Default: Story = {
  args: {}
}

export default meta
