import type { Meta, StoryObj } from '@storybook/react'
import { useState } from '@storybook/preview-api'
import { Select, MenuItem, SelectChangeEvent, FormControl, InputLabel, Box } from '../index'

const meta: Meta<typeof Select> = {
  title: 'Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {}
}
export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {},
  render: function Render() {
    const [age, setAge] = useState('')
    const handleChange = (event: SelectChangeEvent) => {
      setAge(event.target.value as string)
    }
    return (
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
    )
  }
}
