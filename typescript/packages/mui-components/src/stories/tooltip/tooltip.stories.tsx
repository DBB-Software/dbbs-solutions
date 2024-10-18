import type { Meta, StoryObj } from '@storybook/react'
// import { Box, Tooltip, Typography } from '../../index'
import { Tooltip } from './Tooltip'
import { Box } from '../box/Box'
import { Typography } from '../typography/Typography'

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
  tags: ['autodocs']
}
export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    title: 'Tooltip',
    placement: 'top'
  },
  render: (args) => (
    <Box
      sx={{
        width: '300px',
        height: '300px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Tooltip {...args}>
        <div>
          <Typography>Move cursor here </Typography>
        </div>
      </Tooltip>
    </Box>
  )
}
