import { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  Box,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
  CardHeader,
  CardActionArea
} from '../index'

const meta: Meta<typeof Card> = {
  title: 'Card',
  component: Card,
  subcomponents: { CardContent, CardActions, CardMedia, CardHeader, CardActionArea },
  name: 'Card',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['outlined', 'elevation'],
      control: { type: 'select' }
    }
  }
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    variant: 'outlined'
  },
  render: function Render(args) {
    const { variant } = args
    const card = (
      <>
        <CardHeader title="Card header component" />
        <CardMedia sx={{ height: 140 }} image="https://github.com/shadcn.png" title="green iguana" />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            content
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Card Actions</Button>
        </CardActions>
      </>
    )
    return (
      <Box sx={{ maxWidth: 275 }}>
        <Card variant={variant}>{card}</Card>
      </Box>
    )
  }
}

export const CardWithCardActionArea: Story = {
  args: {
    variant: 'outlined'
  },
  render: function Render(args) {
    const { variant } = args
    const card = (
      <CardActionArea>
        <CardHeader title="Card header component" />
        <CardMedia sx={{ height: 140 }} image="https://github.com/shadcn.png" title="green iguana" />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            content
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Card Actions</Button>
        </CardActions>
      </CardActionArea>
    )
    return (
      <Box sx={{ maxWidth: 275 }}>
        <Card variant={variant}>{card}</Card>
      </Box>
    )
  }
}
