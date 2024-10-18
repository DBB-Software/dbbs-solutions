import { Platform, StyleSheet } from 'react-native'
import { MD3Colors } from 'react-native-paper'

export const styles = StyleSheet.create({
  androidContainer: {
    borderRadius: 15,
    height: 15,
    justifyContent: 'center',
    width: 40
  },
  androidToggle: {
    alignItems: 'center',
    backgroundColor: MD3Colors.tertiary100,
    borderRadius: 13,
    height: 26,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3
      },
      android: {
        elevation: 5
      }
    }),
    width: 26
  },
  iOSContainer: {
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 4,
    width: 50
  },
  iOSToggle: {
    alignItems: 'center',
    backgroundColor: MD3Colors.tertiary100,
    borderRadius: 13,
    height: 26,
    justifyContent: 'center',
    width: 26
  }
})
