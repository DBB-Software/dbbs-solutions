import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextInput } from 'react-native-paper'

const meta: Meta<typeof TextInput> = {
  title: 'TextInput',
  component: TextInput,
  decorators: [
    (Story, context) => {
      const [text, setText] = React.useState('')
      return (
        <Story
          args={{
            ...context.args,
            style: {
              margin: 12
            },
            value: text,
            onChangeText: setText
          }}
        />
      )
    }
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Flat: Story = {
  args: {
    label: 'Flat input'
  }
}
export const FlatDisabled: Story = {
  args: {
    label: 'Flat input',
    disabled: true
  }
}
export const Outlined: Story = {
  args: {
    label: 'Outlined input',
    mode: 'outlined'
  }
}
export const OutlinedDisabled: Story = {
  args: {
    label: 'Outlined input',
    mode: 'outlined',
    disabled: true
  }
}
export const OutlinedAffix: Story = {
  args: {
    label: 'Outlined input with Affix',
    mode: 'outlined',
    right: <TextInput.Affix text="/100" />
  }
}
export const OutlinedIcon: Story = {
  args: {
    label: 'Password',
    secureTextEntry: true,
    right: <TextInput.Icon icon="eye" />
  }
}
