import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BadgeProps, Dialog, Text, Button } from 'react-native-paper'
import { ScrollView, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  contentContainerStyle: { paddingHorizontal: 24 },
  text: {
    paddingTop: 24
  }
})

const DEFAULT_ARGS: BadgeProps = {
  visible: true,
  children: (
    <>
      <Dialog.Title>
        <Text>Alert</Text>
      </Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">This is simple dialog</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => console.log('Done')}>
          <Text>Done</Text>
        </Button>
      </Dialog.Actions>
    </>
  ),
  style: {
    marginVertical: 120
  }
}

const meta: Meta<typeof Dialog> = {
  title: 'Dialog',
  component: Dialog,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const BasicIcon: Story = {
  args: {
    children: (
      <>
        <Dialog.Icon icon="alert" />
        <Dialog.Title>
          <Text>Dialog with Icon</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            This is a dialog with new component called DialogIcon. When icon is displayed you should center the header
          </Text>
        </Dialog.Content>
      </>
    )
  }
}
export const BasicScrollArea: Story = {
  args: {
    children: (
      <>
        <Dialog.Title>
          <Text>Dialog with ScrollArea</Text>
        </Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <Text>
              A component to show a scrollable content in a Dialog. The component only provides appropriate styling. For
              the scrollable content you can use ScrollView, FlatList etc. depending on your requirement.
            </Text>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </Text>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </Text>
          </ScrollView>
        </Dialog.ScrollArea>
      </>
    )
  }
}
