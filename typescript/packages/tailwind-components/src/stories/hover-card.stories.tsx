import type { Meta, StoryObj } from '@storybook/react'

import { HoverCard, HoverCardTrigger, HoverCardContent } from '../components/hover-card'
import { Button } from '../components/button'
import { Avatar, AvatarImage, AvatarFallback } from '../components/avatar'

const meta: Meta<typeof HoverCard> = {
  title: 'HoverCard',
  component: HoverCard,
  subcomponents: {
    HoverCardTrigger,
    HoverCardContent
  },
  tags: ['autodocs']
}

type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  args: {},
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">Joined December 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default meta
