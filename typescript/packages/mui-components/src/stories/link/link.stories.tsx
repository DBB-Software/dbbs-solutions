import type { Meta, StoryObj } from '@storybook/react'
import { Link } from './link'

const meta: Meta<typeof Link> = {
  title: 'Link',
  component: Link,
  tags: ['autodocs']
}
export default meta
type Story = StoryObj<typeof Link>

export const Defaul: Story = {
  args: {
    children: 'Link',
    underline: 'hover',
    variant: 'body1'
  },
  render: (props) => <Link {...props}>{props.children}</Link>
}
