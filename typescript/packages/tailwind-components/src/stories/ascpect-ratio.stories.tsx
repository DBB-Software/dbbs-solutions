import type { Meta, StoryObj } from '@storybook/react'

import { AspectRatio } from '../components/aspect-ratio'

const meta: Meta<typeof AspectRatio> = {
  title: 'AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  args: {
    children: 'Click me!'
  },
  argTypes: {
    ratio: {
      control: 'number',
      defaultValue: 16 / 9
    }
  }
}

type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
  args: {},
  render: (args) => (
    <AspectRatio {...args}>
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Photo by Drew Beamer"
        className="rounded-md object-cover"
      />
    </AspectRatio>
  )
}

export default meta
