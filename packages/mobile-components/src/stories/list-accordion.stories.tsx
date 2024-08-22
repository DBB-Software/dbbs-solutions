import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { List } from 'react-native-paper'

const meta: Meta<typeof List.Accordion> = {
  title: 'List/Accordion',
  component: List.Accordion,
  decorators: [
    (Story, context) => {
      const [expanded, setExpanded] = React.useState(true)

      const handlePress = () => setExpanded(!expanded)
      return (
        <Story
          args={{
            ...context.args,
            expanded,
            onPress: handlePress,
            children: (
              <>
                <List.Item title="First item" />
                <List.Item title="Second item" />
              </>
            )
          }}
        />
      )
    }
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    title: 'Expandable list item'
  }
}
export const BasicWithDescription: Story = {
  args: {
    title: 'Expandable list item',
    description: 'Describes the expandable list item'
  }
}
export const BasicWithIcon: Story = {
  args: {
    title: 'Expandable list item',
    left: (props) => <List.Icon {...props} icon="folder" />,
    children: (
      <>
        <List.Item title="First item" left={(props) => <List.Icon {...props} icon="folder" />} />
        <List.Item title="Second item" left={(props) => <List.Icon {...props} icon="folder" />} />
      </>
    )
  }
}
