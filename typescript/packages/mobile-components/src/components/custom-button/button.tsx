import React, { FC, ComponentProps } from 'react'
import { Button } from 'react-native-paper'
import { IconManager, IconManagerType } from '../../utils'

export const DEFAULT_CUSTOM_BUTTON_TEST_ID = 'custom-button'

export type CustomButtonProps = {
  text: string
  onPress: () => void
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'
  loadingText?: string
  customIcon?: keyof IconManagerType
  icon?: string
  isLoading?: boolean
  isDisabled?: boolean
  isDark?: boolean
  isCompact?: boolean
  testID?: string
}

type Props = CustomButtonProps & Omit<ComponentProps<typeof Button>, 'children'>

export const CustomButton: FC<Props> = ({
  text,
  onPress,
  mode = 'outlined',
  loadingText,
  icon,
  customIcon,
  isLoading = false,
  isDisabled = false,
  isDark = false,
  isCompact = false,
  testID = DEFAULT_CUSTOM_BUTTON_TEST_ID,
  ...rest
}) => {
  const selectedIcon = customIcon && IconManager[customIcon]

  return (
    <Button
      testID={testID}
      mode={mode}
      dark={isDark}
      icon={icon ?? selectedIcon}
      compact={isCompact}
      loading={isLoading}
      disabled={isLoading || isDisabled}
      onPress={onPress}
      {...rest}
    >
      {isLoading && loadingText ? loadingText : text}
    </Button>
  )
}
