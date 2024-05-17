import React, { FC } from 'react'
import Svg, { Path } from 'react-native-svg'
import { IconProps } from '../types'

export const Main: FC<IconProps> = ({ color, size, ...rest }) => (
  <Svg width={size} height={size} fill="none" {...rest}>
    <Path stroke={color} />
  </Svg>
)
