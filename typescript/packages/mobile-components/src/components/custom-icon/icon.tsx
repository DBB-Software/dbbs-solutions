import React, { FC } from 'react'
import { Icon } from 'react-native-paper'
import { View } from 'react-native'
import { IconManager, IconManagerType } from './icon-manager'
import { styles } from './styles'

interface IconProps {
  name: keyof IconManagerType
  color?: string
  size?: number
}

const BASE_ICON_SIZE = 25
const BASE_ICON_COLOR = '#000000'

export const CustomIcon: FC<IconProps> = ({ name, color, size }) => {
  const SelectedIcon = IconManager[name]

  if (!SelectedIcon) {
    return (
      <View style={styles.container} testID="paper-icon">
        <Icon size={30} source="progress-question" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SelectedIcon testID="custom-icon" color={color ?? BASE_ICON_COLOR} size={size ?? BASE_ICON_SIZE} />
    </View>
  )
}
