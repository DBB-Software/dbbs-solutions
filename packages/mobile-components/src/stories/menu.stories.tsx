import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Menu, PaperProvider, Button, Text } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 50
  }
})

const meta: Meta<typeof Menu> = {
  title: 'Menu',
  component: Menu,
  decorators: [
    (Story, context) => {
      const [visible, setVisible] = React.useState(false)

      const openMenu = () => setVisible(true)

      const closeMenu = () => setVisible(false)

      return (
        <PaperProvider>
          <View style={styles.wrapper}>
            <Story
              args={{
                ...context.args,
                visible,
                anchor: (
                  <Button onPress={openMenu}>
                    <Text>Show menu</Text>
                  </Button>
                ),
                onDismiss: closeMenu
              }}
            />
          </View>
        </PaperProvider>
      )
    }
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    children: (
      <>
        <Menu.Item onPress={() => {}} title="Item 1" />
        <Menu.Item onPress={() => {}} title="Item 2" />
        <Menu.Item onPress={() => {}} title="Item 3" />
      </>
    )
  }
}
export const BasicIcons: Story = {
  args: {
    children: (
      <>
        <Menu.Item onPress={() => {}} title="Undo" leadingIcon="undo" />
        <Menu.Item onPress={() => {}} title="Redo" leadingIcon="redo" />
        <Menu.Item onPress={() => {}} title="Share" trailingIcon="share" />
      </>
    )
  }
}
