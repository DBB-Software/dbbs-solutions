import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ListAccordionGroupProps, List } from 'react-native-paper'

const DEFAULT_ARGS: ListAccordionGroupProps = {
  children: (
    <>
      <List.Accordion title="Accordion 1" id="1">
        <List.Item title="Item 1" />
      </List.Accordion>
      <List.Accordion title="Accordion 2" id="2">
        <List.Item title="Item 2" />
      </List.Accordion>
      <List.Accordion title="Accordion 3" id="3">
        <List.Item title="Item 3" />
      </List.Accordion>
    </>
  )
}

const meta: Meta<typeof List.AccordionGroup> = {
  title: 'List/AccordionGroup',
  component: List.AccordionGroup,
  args: DEFAULT_ARGS,
  decorators: [(Story) => <Story />]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
