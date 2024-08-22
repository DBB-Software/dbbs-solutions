import { useState, SyntheticEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tab, Box, Tabs } from '../index'

const meta: Meta<typeof Tab> = {
  title: 'Tab',
  component: Tab,
  subcomponents: { Box, Tabs },
  tags: ['autodocs'],
  argTypes: {}
}
export default meta
type Story = StoryObj<typeof Tab>

export const Default: Story = {
  args: {},
  render: function Render() {
    const [value, setValue] = useState('one')

    const handleChange = (event: SyntheticEvent, newValue: string) => {
      setValue(newValue)
    }
    return (
      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
          <Tab value="one" label="One" wrapped />
          <Tab value="two" label="Two" />
          <Tab value="three" label="Three" />
        </Tabs>
      </Box>
    )
  }
}
