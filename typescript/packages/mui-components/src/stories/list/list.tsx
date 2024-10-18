import {
  List as MUIList,
  ListItem as MUIListItem,
  ListItemButton as MUIListItemButton,
  ListSubheader as MUIListSubheader,
  ListItemText as MUIListItemText,
  ListItemAvatar as MUIListItemAvatar,
  ListProps,
  ListItemProps,
  ListItemButtonProps,
  ListSubheaderProps,
  ListItemTextProps,
  ListItemAvatarProps
} from '../..'

const List = (props: ListProps) => <MUIList {...props} />

const ListItem = (props: ListItemProps) => <MUIListItem {...props} />

const ListItemButton = (props: ListItemButtonProps) => <MUIListItemButton {...props} />

const ListSubheader = (props: ListSubheaderProps) => <MUIListSubheader {...props} />

const ListItemText = (props: ListItemTextProps) => <MUIListItemText {...props} />

const ListItemAvatar = (props: ListItemAvatarProps) => <MUIListItemAvatar {...props} />

export { List, ListItem, ListItemButton, ListSubheader, ListItemText, ListItemAvatar }
