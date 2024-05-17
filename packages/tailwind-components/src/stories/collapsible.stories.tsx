import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../components/collapsible'
import { Button } from '../components/button'

const meta: Meta<typeof Collapsible> = {
  title: 'Collapsible',
  component: Collapsible,
  subcomponents: {
    CollapsibleTrigger,
    CollapsibleContent
  },
  tags: ['autodocs']
}

type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  args: {},
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@radix-ui/primitives</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
    )
  }
}

export default meta
