import { AlertProps, Alert as MUIAlert, AlertTitle as MUIAlertTitle, AlertTitleProps } from '../..'

const Alert = (props: AlertProps) => <MUIAlert {...props} />

const AlertTitle = (props: AlertTitleProps) => <MUIAlertTitle {...props} />

export { Alert, AlertTitle }
