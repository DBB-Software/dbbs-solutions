import { FC } from 'react'
import * as SVGs from '../svg'
import { IconProps } from '../types'

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
