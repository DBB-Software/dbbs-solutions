import { ReactElement, ReactNode } from 'react'
import { ViewStyle } from 'react-native'

export type ToastType = 'success' | 'error' | 'loading' | 'blank' | 'custom'
export type ToastPosition = 'top' | 'bottom'

export type Renderable = ReactNode | ReactElement | string | null

export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue
export type ValueOrFunction<TValue, TArg> = TValue | ValueFunction<TValue, TArg>

const isFunction = <TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>
): valOrFunction is ValueFunction<TValue, TArg> => typeof valOrFunction === 'function'

export const resolveValue = <TValue, TArg>(valOrFunction: ValueOrFunction<TValue, TArg>, arg: TArg): TValue =>
  isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction

export interface Toast {
  type: ToastType
  id: string
  message: ValueOrFunction<Renderable, Toast>
  createdAt: number
  visible: boolean
  pauseDuration: number
  duration?: number
  position?: ToastPosition
  style?: ViewStyle
  height?: number
}

export type ToastOptions = Partial<Pick<Toast, 'id' | 'duration' | 'style' | 'position'>>

export type DefaultToastOptions = ToastOptions & {
  [key in ToastType]?: ToastOptions
}

export interface ToasterProps {
  position?: ToastPosition
  toastOptions?: DefaultToastOptions
  gutter?: number
  containerStyle?: ViewStyle
  toastBarStyle?: ViewStyle
  children?: (toast: Toast) => ReactNode | ReactElement
}
