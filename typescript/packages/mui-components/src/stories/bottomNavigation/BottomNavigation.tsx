import {
  BottomNavigation as MUIBottomNavigation,
  BottomNavigationProps,
  BottomNavigationAction as MUIBottomNavigationAction,
  BottomNavigationActionProps
} from '../..'

const BottomNavigation = (props: BottomNavigationProps) => <MUIBottomNavigation {...props} />
const BottomNavigationAction = (props: BottomNavigationActionProps) => <MUIBottomNavigationAction {...props} />

export { BottomNavigation, BottomNavigationAction }
