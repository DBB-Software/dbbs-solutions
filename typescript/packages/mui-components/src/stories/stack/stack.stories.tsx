import type { Meta, StoryObj } from '@storybook/react'

import { Stack } from './Stack'
import { Paper } from '../paper/Paper'
import { styled } from '../..'

const meta: Meta<typeof Stack> = {
  title: 'Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    spacing: {
      control: { type: 'number' },
      description: 'The space between items'
    },
    direction: {
      control: { type: 'select' },
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
      description: 'The direction of the stack'
    }
  }
}
export default meta
type Story = StoryObj<typeof Stack>

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

export const Default: Story = {
  args: {
    spacing: 2,
    direction: 'row'
  },
  render: (args) => (
    <Stack {...args}>
      <Item>Item 1</Item>
      <Item>Item 2</Item>
      <Item>Item 3</Item>
    </Stack>
  )
}
