import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, Radio, Box } from '../index'

const meta: Meta<typeof RadioGroup> = {
  title: 'RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    row: {
      control: { type: 'boolean' },
      descriptionL: 'If true, the radio group will be displayed in row'
    }
  }
}
export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  args: {
    row: false
  },
  render: function Render(args) {
    const { row } = args
    return (
      <Box width="fit-content">
        <RadioGroup row={row}>
          <Radio value="primary" color="primary" />
          <Radio value="neutral" color="error" />
          <Radio value="danger" color="secondary" />
          <Radio value="success" color="success" />
          <Radio value="warning" color="warning" />
        </RadioGroup>
      </Box>
    )
  }
}
