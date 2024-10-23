import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Drawer } from 'react-native-paper'

const meta: Meta<typeof Drawer.Section> = {
  title: 'Drawer/Section',
  component: Drawer.Section,
  decorators: [
    (Story) => {
      const [active, setActive] = React.useState('first')
      return (
        <Story
          args={{
            title: 'Example items',
            children: (
              <>
                <Drawer.Item
                  label="Inbox"
                  icon="inbox"
                  active={active === 'first'}
                  onPress={() => setActive('first')}
                />
                <Drawer.Item
                  label="Starred"
                  icon="star"
                  active={active === 'second'}
                  onPress={() => setActive('second')}
                />
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

export const Basic: Story = {}
