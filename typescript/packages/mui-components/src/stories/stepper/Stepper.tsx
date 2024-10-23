import {
  Step as MUIStep,
  StepLabel as MUIStepLabel,
  Stepper as MUIStepper,
  StepProps,
  StepLabelProps,
  StepperProps
} from '../..'

const Step = (props: StepProps) => <MUIStep {...props} />

const StepLabel = (props: StepLabelProps) => <MUIStepLabel {...props} />

const Stepper = (props: StepperProps) => <MUIStepper {...props} />

export { Step, StepLabel, Stepper }
