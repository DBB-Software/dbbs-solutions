import React, { FC, ComponentProps, ReactElement, ReactNode } from 'react'
import { Platform, KeyboardAvoidingView, KeyboardAvoidingViewProps } from 'react-native'
import { styles } from './styles'

type BehaviorType = 'height' | 'position' | 'padding' | undefined

export const KEYBOARD_AVOIDING_VIEW_TEST_ID = 'KEYBOARD_AVOIDING_VIEW_TEST_ID'

export interface KeyboardViewProps extends KeyboardAvoidingViewProps {
  children: ReactElement | ReactNode
  androidBehavior?: BehaviorType
  iosBehavior?: BehaviorType
}

type Props = KeyboardViewProps & Omit<ComponentProps<typeof KeyboardAvoidingView>, 'children'>

export const KeyboardView: FC<Props> = (props) => {
  const { children, androidBehavior = 'height', iosBehavior = 'padding', behavior } = props
  const behaviorProps = behavior || Platform.OS === 'ios' ? iosBehavior : androidBehavior

  return (
    <KeyboardAvoidingView
      testID={KEYBOARD_AVOIDING_VIEW_TEST_ID}
      behavior={behaviorProps}
      style={styles.container}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  )
}
