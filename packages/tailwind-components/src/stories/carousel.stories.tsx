import type { Meta, StoryObj } from '@storybook/react'

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../components/carousel'
import { CardContent, Card } from '../components/card'

const meta: Meta<typeof Carousel> = {
  title: 'Carousel',
  component: Carousel,
  subcomponents: {
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext
  },
  tags: ['autodocs']
}

type Story = StoryObj<typeof Carousel>

export const Default: Story = {
  args: {},
  render: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default meta
