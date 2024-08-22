import { Meta, StoryObj } from '@storybook/react'
import { Breadcrumbs, Typography } from '../index'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
  subcomponents: { Typography },
  tags: ['autodocs'],
  argTypes: {}
}

export default meta
type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {
  render: () => (
    <Breadcrumbs aria-label="breadcrumb">
      <Typography color="text.primary">MUI</Typography>
      <Typography color="text.primary">Core</Typography>
      <Typography color="text.primary">Breadcrumbs</Typography>
    </Breadcrumbs>
  )
}
