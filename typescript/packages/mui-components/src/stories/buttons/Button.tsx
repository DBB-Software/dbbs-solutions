import { IconButton as MUIIconButton, IconButtonProps, Button as MUIButton, ButtonProps } from '../..'

const Button = (props: ButtonProps) => <MUIButton {...props} />

const IconButton = (props: IconButtonProps) => <MUIIconButton {...props} />

export { Button, IconButton }
