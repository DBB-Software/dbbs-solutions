import { Meta, StoryObj } from '@storybook/react'
import { Breadcrumbs } from './Breadcrumbs'
import { Typography } from '../typography/Typography'

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
  render: (args) => (
    <Breadcrumbs {...args} aria-label="breadcrumb">
      <Typography color="text.primary">MUI</Typography>
      <Typography color="text.primary">Core</Typography>
      <Typography color="text.primary">Breadcrumbs</Typography>
    </Breadcrumbs>
  )
}
