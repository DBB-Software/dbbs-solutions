import type { Meta, StoryObj } from '@storybook/react'

import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '../components/input-otp'

const meta: Meta<typeof InputOTP> = {
  title: 'InputOTP',
  component: InputOTP,
  subcomponents: {
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator
  },
  tags: ['autodocs']
}

type Story = StoryObj<typeof InputOTP>

export const Default: Story = {
  args: {},
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

export default meta
