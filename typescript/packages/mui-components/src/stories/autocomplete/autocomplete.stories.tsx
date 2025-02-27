import { Meta, StoryObj } from '@storybook/react'
import { ComponentType } from 'react'
import { Autocomplete } from './Autocomplete'
import { TextField } from '../textField/TextField'

const meta: Meta<typeof Autocomplete> = {
  title: 'Autocomplete',
  component: Autocomplete,
  subcomponents: { TextField: TextField as ComponentType<unknown> },
  parameters: {
    controls: { expanded: true }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Autocomplete>

const options = ['Option 1', 'Option 2', 'Option 3']

export const Default: Story = {
  render: (args) => (
    <Autocomplete
      {...args}
      options={options}
      renderInput={(params) => <TextField {...params} label="Autocomplete" />}
    />
  )
}
