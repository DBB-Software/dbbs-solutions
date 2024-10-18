import {
  ToggleButton as MUIToggleButton,
  ToggleButtonGroup as MUIToggleButtonGroup,
  ToggleButtonProps,
  ToggleButtonGroupProps
} from '../..'

const ToggleButton = (props: ToggleButtonProps) => <MUIToggleButton {...props} />

const ToggleButtonGroup = (props: ToggleButtonGroupProps) => <MUIToggleButtonGroup {...props} />

export { ToggleButton, ToggleButtonGroup }
