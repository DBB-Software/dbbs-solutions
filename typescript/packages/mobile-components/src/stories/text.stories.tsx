import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Text } from 'react-native-paper'

const meta: Meta<typeof Text> = {
  title: 'Text',
  component: Text,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const DisplayLarge: Story = {
  args: {
    variant: 'displayLarge',
    children: 'Display Large'
  }
}
export const DisplayMedium: Story = {
  args: {
    variant: 'displayMedium',
    children: 'Display Medium'
  }
}
export const DisplaySmall: Story = {
  args: {
    variant: 'displaySmall',
    children: 'Display Small'
  }
}

export const HeadlineLarge: Story = {
  args: {
    variant: 'displayLarge',
    children: 'Headline Large'
  }
}
export const HeadlineMedium: Story = {
  args: {
    variant: 'headlineMedium',
    children: 'Headline Large'
  }
}
export const HeadlineSmall: Story = {
  args: {
    variant: 'headlineSmall',
    children: 'Headline Large'
  }
}

export const TitleLarge: Story = {
  args: {
    variant: 'titleLarge',
    children: 'Title Large'
  }
}
export const TitleMedium: Story = {
  args: {
    variant: 'titleMedium',
    children: 'Title Medium'
  }
}
export const TitleSmall: Story = {
  args: {
    variant: 'titleSmall',
    children: 'Title Small'
  }
}

export const BodyLarge: Story = {
  args: {
    variant: 'bodyLarge',
    children: 'Body Large'
  }
}
export const BodyMedium: Story = {
  args: {
    variant: 'bodyMedium',
    children: 'Body Medium'
  }
}
export const BodySmall: Story = {
  args: {
    variant: 'bodySmall',
    children: 'Body Small'
  }
}

export const LabelLarge: Story = {
  args: {
    variant: 'labelLarge',
    children: 'Label Large'
  }
}
export const LabelMedium: Story = {
  args: {
    variant: 'labelMedium',
    children: 'Label Medium'
  }
}
export const LabelSmall: Story = {
  args: {
    variant: 'labelSmall',
    children: 'Label Large'
  }
}
