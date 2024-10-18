import type { Meta, StoryObj } from '@storybook/react'

import { Box } from '../box/Box'
import { Collapse } from './Collapse'
import { Typography } from '../typography/Typography'

const meta: Meta<typeof Collapse> = {
  title: 'Collapse',
  component: Collapse,
  tags: ['autodocs']
}
export default meta
type Story = StoryObj<typeof Collapse>

export const Default: Story = {
  render: function Render(args) {
    return (
      <Collapse {...args}>
        <Box>
          <Typography>This is a Collapse component</Typography>
        </Box>
      </Collapse>
    )
  }
}
