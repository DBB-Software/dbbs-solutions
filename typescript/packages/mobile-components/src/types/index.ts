import { SvgProps } from 'react-native-svg'

export interface IconProps extends SvgProps {
  color: string
  size: number
}

export type ItemTypeFromArray<T> = T extends (infer U)[] ? U : T
