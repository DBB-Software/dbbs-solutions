import {
  Accordion as MUIAccordion,
  AccordionProps,
  AccordionSummary as MUIAccordionSummary,
  AccordionSummaryProps,
  AccordionDetails as MUIAccordionDetails,
  AccordionDetailsProps,
  AccordionActions as MUIAccordionActions,
  AccordionActionsProps
} from '../..'

const Accordion = (props: AccordionProps) => <MUIAccordion {...props} />

const AccordionSummary = (props: AccordionSummaryProps) => <MUIAccordionSummary {...props} />

const AccordionDetails = (props: AccordionDetailsProps) => <MUIAccordionDetails {...props} />

const AccordionActions = (props: AccordionActionsProps) => <MUIAccordionActions {...props} />

export { Accordion, AccordionSummary, AccordionDetails, AccordionActions }
