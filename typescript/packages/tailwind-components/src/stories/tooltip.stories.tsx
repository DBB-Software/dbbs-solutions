import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/tooltip'
import { Button } from '../components/button'

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
  subcomponents: {
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  },
  tags: ['autodocs']
}

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {},
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default meta
