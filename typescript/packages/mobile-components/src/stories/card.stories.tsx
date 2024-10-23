import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardProps, Button, Avatar, Text } from 'react-native-paper'

const LeftContent = (props: { size: number }) => <Avatar.Icon {...props} icon="folder" />

const DEFAULT_ARGS: CardProps = {
  children: (
    <>
      <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
      <Card.Content>
        <Text variant="titleLarge">Card title</Text>
        <Text variant="bodyMedium">Card content</Text>
      </Card.Content>
      <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
      <Card.Actions>
        <Button>
          <Text>Cancel</Text>
        </Button>
        <Button>
          <Text>Ok</Text>
        </Button>
      </Card.Actions>
    </>
  ),
  style: {
    margin: 12
  }
}

const meta: Meta<typeof Card> = {
  title: 'Card',
  component: Card,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicOutlined: Story = {
  args: {
    mode: 'outlined'
  }
}
export const BasicContained: Story = {
  args: {
    mode: 'contained'
  }
}
