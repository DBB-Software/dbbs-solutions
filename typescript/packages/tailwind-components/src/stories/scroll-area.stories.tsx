import type { Meta, StoryObj } from '@storybook/react'

import { ScrollArea } from '../components/scroll-area'
import { Separator } from '../components/separator'

const meta: Meta<typeof ScrollArea> = {
  title: 'ScrollArea',
  component: ScrollArea,
  tags: ['autodocs']
}

type Story = StoryObj<typeof ScrollArea>

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

export const Default: Story = {
  args: {},
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}

export default meta
