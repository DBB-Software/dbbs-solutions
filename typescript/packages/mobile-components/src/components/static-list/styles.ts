import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})

export const getListItemStyle = (isHorizontal: boolean, interval: number, columns: number) => {
  const flex = columns > 1 && !isHorizontal ? 0 : 1
  const marginRight = isHorizontal ? interval : 0
  const marginTop = isHorizontal ? 0 : interval
  const paddingLeft = columns > 1 && !isHorizontal ? interval / 2 : 0
  const paddingRight = columns > 1 && !isHorizontal ? interval / 2 : 0

  return StyleSheet.create({
    conditionalStyle: {
      flex,
      marginRight,
      marginTop,
      paddingLeft,
      paddingRight,
      width: `${100 / columns}%`
    }
  })
}
