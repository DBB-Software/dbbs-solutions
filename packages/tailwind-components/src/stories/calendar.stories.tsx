import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Calendar } from '../components/calendar'

const meta: Meta<typeof Calendar> = {
  title: 'Calendar',
  component: Calendar,
  tags: ['autodocs']
}

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {},
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border shadow" />
  }
}

export default meta
