import { FC } from 'react'
import type { IconProps } from '../../shared/types'
import * as SVGs from './svg'

export const ExistedSvg = {
  main: 'main'
}

export type IconManagerType = {
  [key in keyof typeof ExistedSvg]: FC<IconProps>
}

export const IconManager = Object.entries(SVGs).reduce((acc, [name, Component]) => {
  acc[name.toLowerCase() as keyof IconManagerType] = Component
  return acc
}, {} as IconManagerType)
