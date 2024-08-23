import { Meta, StoryObj } from '@storybook/react'

import { BottomNavigation, BottomNavigationAction } from '../index'

const meta: Meta<typeof BottomNavigation> = {
  title: 'BottomNavigation',
  subcomponents: { BottomNavigationAction },
  component: BottomNavigation,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta
type Story = StoryObj<typeof BottomNavigation>

export const Default: Story = {
  render: () => (
    <BottomNavigation showLabels>
      <BottomNavigationAction label="Recents" />
      <BottomNavigationAction label="Favorites" />
      <BottomNavigationAction label="Nearby" />
    </BottomNavigation>
  )
}
