import type { Meta, StoryObj } from '@storybook/react'
import { Box, Tooltip, Typography } from '../index'

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'The title of the tooltip.'
    },
    placement: {
      options: [
        'top',
        'top-end',
        'right-start',
        'right',
        'right-end',
        'bottom-start',
        'bottom',
        'bottom-end',
        'left-start',
        'left',
        'left-end'
      ],
      control: { type: 'select' },
      description: 'The placement of the tooltip.'
    }
  }
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
        <Typography>Move cursor here </Typography>
      </Tooltip>
    </Box>
  )
}
