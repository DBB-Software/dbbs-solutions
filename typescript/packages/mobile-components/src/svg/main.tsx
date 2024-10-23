import React, { FC } from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'
import { IconProps } from '../types'

export const Main: FC<IconProps> = ({ color, size, ...rest }) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none" {...rest}>
    <G clipPath="url(#clip0_2927_1376)" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M28.929 15A13.929 13.929 0 011.07 15m27.858 0A13.929 13.929 0 001.07 15m27.858 0H1.07" />
      <Path d="M20.357 15A24.043 24.043 0 0115 28.928 24.043 24.043 0 019.643 15 24.043 24.043 0 0115 1.07 24.043 24.043 0 0120.357 15z" />
    </G>
    <Defs>
      <ClipPath id="clip0_2927_1376">
        <Path fill="#fff" d="M0 0H30V30H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
