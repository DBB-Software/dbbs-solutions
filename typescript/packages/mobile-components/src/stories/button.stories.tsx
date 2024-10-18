import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CustomButton, CustomButtonProps } from '../components/custom-button'

const DEFAULT_ARGS: CustomButtonProps = {
  text: 'Button text',
  onPress: () => console.log('onPress')
}

const meta: Meta<typeof CustomButton> = {
  title: 'CustomButton',
  component: CustomButton,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const BasicOutlined: Story = {}
export const BasicText: Story = {
  args: { mode: 'text' }
}
export const BasicContained: Story = {
  args: { mode: 'contained' }
}
export const BasicElevated: Story = {
  args: { mode: 'elevated' }
}
export const BasicContainedTonal: Story = {
  args: { mode: 'contained-tonal' }
}
export const LoadingOutlined: Story = {
  args: { isLoading: true }
}
export const LoadingWithTextOutlined: Story = {
  args: { isLoading: true, loadingText: 'Loading Text' }
}
export const DisabledOutlined: Story = {
  args: { isDisabled: true }
}
export const DarkOutlined: Story = {
  args: { isDark: true }
}
export const CompactOutlined: Story = {
  args: { isCompact: true }
}
export const WithIconOutlined: Story = {
  args: { icon: 'camera' }
}
export const WithCustomIconOutlined: Story = {
  args: { customIcon: 'main' }
}
export const CustomTextColorOutlined: Story = {
  args: { textColor: 'green' }
}
export const CustomButtonColorOutlined: Story = {
  args: { buttonColor: 'green' }
}
export const CustomStyleOutlined: Story = {
  args: { style: { borderRadius: 1, backgroundColor: 'blue' } }
}
