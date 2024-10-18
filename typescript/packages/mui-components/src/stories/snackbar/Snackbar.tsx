import {
  Snackbar as MUISnackbar,
  SnackbarContent as MUISnackbarContent,
  SnackbarProps,
  SnackbarContentProps
} from '../..'

const Snackbar = (props: SnackbarProps) => <MUISnackbar {...props} />

const SnackbarContent = (props: SnackbarContentProps) => <MUISnackbarContent {...props} />

export { Snackbar, SnackbarContent }
