import { Menu as MUIMenu, MenuItem as MUIMenuItem, MenuProps, MenuItemProps } from '../..'

const Menu = (props: MenuProps) => <MUIMenu {...props} />

const MenuItem = (props: MenuItemProps) => <MUIMenuItem {...props} />

export { Menu, MenuItem }
