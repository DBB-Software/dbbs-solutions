import type { Meta, StoryObj } from '@storybook/react'

import { Popover, PopoverContent, PopoverTrigger } from '../components/popover'
import { Button } from '../components/button'
import { Input } from '../components/input'
import { Label } from '../components/label'

const meta: Meta<typeof Popover> = {
  title: 'Popover',
  component: Popover,
  subcomponents: {
    PopoverContent,
    PopoverTrigger
  },
  tags: ['autodocs']
}

type Story = StoryObj<typeof Popover>

export const Default: Story = {
  args: {},
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default meta
