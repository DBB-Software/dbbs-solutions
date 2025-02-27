import type { Meta, StoryObj } from '@storybook/react'
import { ComponentType } from 'react'
import { Button } from '../buttons/Button'

import { Accordion, AccordionSummary, AccordionDetails, AccordionActions } from './Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Accordion',
  component: Accordion,
  subcomponents: {
    AccordionSummary: AccordionSummary as ComponentType<unknown>,
    AccordionDetails: AccordionDetails as ComponentType<unknown>,
    AccordionActions: AccordionActions as ComponentType<unknown>,
    Button: Button as ComponentType<unknown>
  },
  tags: ['autodocs']
}
export default meta

type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: (args) => (
    <>
      <Accordion {...args}>
        <AccordionSummary>Accordion 1</AccordionSummary>
        <AccordionDetails>Accordion 1 details</AccordionDetails>
      </Accordion>
      <Accordion {...args}>
        <AccordionSummary>Accordion 2</AccordionSummary>
        <AccordionDetails>Accordion 2 details</AccordionDetails>
        <AccordionActions>
          <Button>Cancel</Button>
          <Button>Agree</Button>
        </AccordionActions>
      </Accordion>
    </>
  )
}
