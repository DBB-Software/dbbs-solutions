import {
  Dialog as MUIDialog,
  DialogTitle as MUIDialogTitle,
  DialogContent as MUIDialogContent,
  DialogContentText as MUIDialogContentText,
  DialogActions as MUIDialogActions,
  DialogProps,
  DialogTitleProps,
  DialogContentProps,
  DialogContentTextProps,
  DialogActionsProps
} from '../..'

const Dialog = (props: DialogProps) => <MUIDialog {...props} />

const DialogTitle = (props: DialogTitleProps) => <MUIDialogTitle {...props} />

const DialogContent = (props: DialogContentProps) => <MUIDialogContent {...props} />

const DialogContentText = (props: DialogContentTextProps) => <MUIDialogContentText {...props} />

const DialogActions = (props: DialogActionsProps) => <MUIDialogActions {...props} />

export { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions }
