import type { Meta, StoryObj } from '@storybook/react'
import { Menu } from '../index'

const meta: Meta<typeof Menu> = {
  title: 'Menu',
  component: Menu,

  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'If true, the component is shown.'
    },
    autoFocus: {
      description:
        'If true (Default) will focus the [role=&quot;menu&quot;] if no focusable child is found. Disabled children are not focusable. If you set this prop to false focus will be placed on the parent modal container. This has severe accessibility implications and should only be considered if you manage focus otherwise.',
      control: { type: 'boolean' }
    },
    children: {
      description: 'Menu contents, normally MenuItems.'
    },
    variant: {
      control: { type: 'select' },
      options: ['menu', 'selectedMenu'],
      description: 'The variant to use. Use menu to prevent selected items from impacting the initial focus.'
    }
  }
}
export default meta
type Story = StoryObj<typeof Menu>

export const Default: Story = {}
