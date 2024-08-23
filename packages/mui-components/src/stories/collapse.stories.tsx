import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'

import { Box, Collapse, Typography } from '../index'

const meta: Meta<typeof Collapse> = {
  title: 'Collapse',
  component: Collapse,
  tags: ['autodocs'],
  argTypes: {
    in: { control: 'boolean' }
  }
}
export default meta
type Story = StoryObj<typeof Collapse>

export const Default: Story = {
  args: {
    in: true
  },
  render: function Render() {
    const [args] = useArgs()
    return (
      <Collapse {...args}>
        <Box>
          <Typography>This is a Collapse component</Typography>
        </Box>
      </Collapse>
    )
  }
}
