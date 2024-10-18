import type { Meta, StoryObj } from '@storybook/react'

import { RadioGroup, RadioGroupItem } from '../components/radio-group'
import { Label } from '../components/label'

const meta: Meta<typeof RadioGroup> = {
  title: 'RadioGroup',
  component: RadioGroup,
  subcomponents: {
    RadioGroupItem
  },
  tags: ['autodocs']
}

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  args: {},
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  )
}

export default meta
