import type { Meta, StoryObj } from '@storybook/react'

import { Accordion, AccordionSummary, AccordionDetails, AccordionActions, Button } from '../index'

const meta: Meta<typeof Accordion> = {
  title: 'Accordion',
  name: 'Accordion',
  component: Accordion,
  subcomponents: { AccordionSummary, AccordionDetails, AccordionActions, Button },
  args: {},
  argTypes: {},
  tags: ['autodocs']
}
export default meta

type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  args: {},
  render: () => (
    <>
      <Accordion>
        <AccordionSummary>Accordion 1</AccordionSummary>
        <AccordionDetails>Accordion 1 details</AccordionDetails>
      </Accordion>
      <Accordion>
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
