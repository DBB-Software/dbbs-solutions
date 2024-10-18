import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Image } from 'react-native'
import { Banner, BannerProps } from 'react-native-paper'

const DEFAULT_ARGS: BannerProps = {
  visible: true,
  children: 'There was a problem processing a transaction on your credit card.',
  actions: [
    {
      label: 'Fix it',
      onPress: () => console.log('Fix it')
    },
    {
      label: 'Learn more',
      onPress: () => console.log('Learn more')
    }
  ],
  icon: ({ size }) => (
    <Image
      source={{
        uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4'
      }}
      style={{
        width: size,
        height: size
      }}
    />
  )
}

const meta: Meta = {
  title: 'Banner',
  component: Banner,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}
export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
