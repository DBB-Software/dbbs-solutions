import { useState, MouseEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ToggleButton, ToggleButtonGroup } from '../index'

const meta: Meta<typeof ToggleButton> = {
  title: 'ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  argTypes: {}
}
export default meta
type Story = StoryObj<typeof ToggleButton>

const ToggleButtons = () => {
  const [alignment, setAlignment] = useState<string | null>('left')

  const handleAlignment = (event: MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment)
  }

  return (
    <ToggleButtonGroup value={alignment} exclusive onChange={handleAlignment} aria-label="text alignment">
      <ToggleButton value="left" aria-label="left aligned">
        test 1
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        test 2
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        test 3
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified">
        test 4
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export const Default: Story = {
  render: () => <ToggleButtons />
}
