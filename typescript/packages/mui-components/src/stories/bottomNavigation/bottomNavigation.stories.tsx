import { Meta, StoryObj } from '@storybook/react'

import { BottomNavigation, BottomNavigationAction } from './BottomNavigation'

const meta: Meta<typeof BottomNavigation> = {
  title: 'BottomNavigation',
  subcomponents: { BottomNavigationAction },
  component: BottomNavigation,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof BottomNavigation>

export const Default: Story = {
  render: (args) => (
    <BottomNavigation {...args}>
      <BottomNavigationAction label="Recents" />
      <BottomNavigationAction label="Favorites" />
      <BottomNavigationAction label="Nearby" />
    </BottomNavigation>
  )
}