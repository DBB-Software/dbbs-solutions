import {
  SpeedDial as MUISpeedDial,
  SpeedDialProps,
  SpeedDialAction as MUISpeedDialAction,
  SpeedDialActionProps
} from '../..'

const SpeedDial = (props: SpeedDialProps) => <MUISpeedDial {...props} />

const SpeedDialAction = (props: SpeedDialActionProps) => <MUISpeedDialAction {...props} />

export { SpeedDial, SpeedDialAction }
