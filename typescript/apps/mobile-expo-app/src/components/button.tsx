import React from 'react'
import { Button } from 'react-native'
import { useAppTheme } from '@dbbs/mobile-components'

export const StoriesButton = () => {
  const { colors } = useAppTheme()
  return <Button color={colors.primary} title="Stories Button" />
}
