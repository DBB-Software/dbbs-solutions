import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '../box/Box'
import { Select, FormControl, InputLabel } from './Select'
import { MenuItem } from '../menu/Menu'

const meta: Meta<typeof Select> = {
  title: 'Select',
  component: Select,
  tags: ['autodocs']
}
export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: function Render(args) {
    return (
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select {...args} labelId="demo-simple-select-label" id="demo-simple-select" label="Age">
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
    )
  }
}
