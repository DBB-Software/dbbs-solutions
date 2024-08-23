import type { Meta, StoryObj } from '@storybook/react'
import { Link } from '../index'

const meta: Meta<typeof Link> = {
  title: 'Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    underline: {
      description: 'Controls when the link should have an underline.',
      options: ['hover', 'always', 'none'],
      control: { type: 'select' }
    },
    variant: {
      describe: 'Applies the theme typography styles.',
      control: {
        type: 'select'
      },
      options: [
        'inherit',
        'body1',
        'body2',
        'button',
        'caption',
        'overline',
        'subtitle1',
        'subtitle2',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6'
      ]
    }
  }
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
