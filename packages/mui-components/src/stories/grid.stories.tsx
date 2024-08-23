import type { Meta, StoryObj } from '@storybook/react'

import { Grid, Paper, styled } from '../index'

const meta: Meta<typeof Grid> = {
  title: 'Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    spacing: {
      control: { type: 'number' },
      description: 'To control space between children, use the spacing prop.'
    },
    container: {
      control: { type: 'boolean' },
      description:
        'If true, the component will have the flex container behavior. You should be wrapping items with a container.'
    }
  }
}
export default meta
type Story = StoryObj<typeof Grid>

export const Default: Story = {
  args: {
    spacing: 2,
    container: true
  },
  render: function Render(args) {
    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: '#fff',
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary
    }))

    return (
      <Grid {...args}>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>
    )
  }
}
