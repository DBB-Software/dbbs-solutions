import { Meta, StoryObj } from '@storybook/react'
import { ComponentType } from 'react'
import { ImageList, ImageListItem, ImageListItemBar } from './imageList'

const meta: Meta<typeof ImageList> = {
  title: 'ImageList',
  component: ImageList,
  subcomponents: {
    ImageListItem: ImageListItem as ComponentType<unknown>,
    ImageListItemBar: ImageListItemBar as ComponentType<unknown>
  },
  tags: ['autodocs'],
  argTypes: {
    cols: {
      control: { type: 'number' },
      description: 'Number of columns.'
    },
    gap: {
      control: { type: 'number' },
      description: 'The gap between items in px.'
    },
    variant: {
      options: ['masonry', 'quilted', 'standard', 'woven'],
      control: { type: 'select' },
      description: 'The variant to use.'
    }
  }
}

export default meta
type Story = StoryObj<typeof ImageList>

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
    rows: 2,
    cols: 2,
    featured: true
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726'
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik'
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
    cols: 2
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
    cols: 2
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
    featured: true
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta'
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman'
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
    rows: 2,
    cols: 2
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls'
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster'
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
    cols: 2
  }
]

export const Default: Story = {
  args: {
    cols: 2,
    gap: 8,
    variant: 'standard'
  },
  render: function Render(args) {
    return (
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164} {...args}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    )
  }
}

export const ImageListWithTitleBars: Story = {
  args: {
    ...Default.args
  },
  render: function Render(args) {
    return (
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164} {...args}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar title={item.title} subtitle={item.author} />
          </ImageListItem>
        ))}
      </ImageList>
    )
  }
}
