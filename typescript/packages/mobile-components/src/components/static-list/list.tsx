import React, { FC, ComponentProps } from 'react'
import { ScrollView, View } from 'react-native'
import { styles, getListItemStyle } from './styles'

export const DEFAULT_LIST_TEST_ID = 'list'
export const DEFAULT_LIST_ITEM_TEST_ID = 'listItem'

export interface StaticListProps {
  listItems: React.ReactNode[]
  interval?: number
  columns?: number
  isHorizontal?: boolean
}

type Props = StaticListProps & Omit<ComponentProps<typeof ScrollView>, 'children'>

export const StaticList: FC<Props> = ({ listItems, isHorizontal = false, interval = 16, columns = 1, ...rest }) => {
  const conditionalStyles = getListItemStyle(isHorizontal, interval, columns)

  return (
    <View style={styles.container} testID={DEFAULT_LIST_TEST_ID}>
      <ScrollView
        style={styles.container}
        horizontal={isHorizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={!isHorizontal && columns > 1 ? styles.contentContainer : {}}
        {...rest}
      >
        {listItems.map((item, index) => (
          <View
            testID={`${DEFAULT_LIST_ITEM_TEST_ID}${index}`}
            style={conditionalStyles.conditionalStyle}
            key={`key${index}`}
          >
            {item}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
