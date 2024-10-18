import { Meta, StoryObj } from '@storybook/react'
import { Box } from './Box'

const meta: Meta<typeof Box> = {
  title: 'Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta
type Story = StoryObj<typeof Box>

export const Default: Story = {
  args: {
    height: 300,
    width: 300,
    m: 1,
    p: 1
  },
  render: function Render(args) {
    const { height, width, m, p } = args

    return (
      <Box component="section" height={height} width={width} m={m} p={p} sx={{ border: '1px dashed grey' }}>
        This Box renders as an HTML section element.
      </Box>
    )
  }
}
