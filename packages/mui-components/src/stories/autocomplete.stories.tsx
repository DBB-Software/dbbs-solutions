import { Meta, StoryObj } from '@storybook/react'
import { Autocomplete, TextField } from '../index'

const meta: Meta<typeof Autocomplete> = {
  title: 'Autocomplete',
  component: Autocomplete,
  subcomponents: { TextField },
  parameters: {
    controls: { expanded: true }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Autocomplete>

const options = ['Option 1', 'Option 2', 'Option 3']

export const Default: Story = {
  render: () => (
    <Autocomplete options={options} renderInput={(params) => <TextField {...params} label="Autocomplete" />} />
  )
}
