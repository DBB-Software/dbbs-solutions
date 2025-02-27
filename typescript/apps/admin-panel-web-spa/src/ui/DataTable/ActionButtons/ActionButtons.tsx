import React, { FC, useState, MouseEvent, ReactNode, Children, isValidElement } from 'react'
import { IconButton, Menu, MenuItem } from '@dbbs/mui-components'
import { EllipsisVertical } from 'lucide-react'

import { makeSxStyles } from '../../../utils'

export interface ActionButtonsProps {
  rowId: string
  showInMenu?: boolean
  children: ReactNode
}

const makeStyles = () =>
  makeSxStyles({
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }
  })

export const ActionButtons: FC<ActionButtonsProps> = ({ rowId, showInMenu = false, children }) => {
  const styles = makeStyles()
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const extractValidChildren = (nodes: ReactNode): ReactNode[] => {
    const validChildren: ReactNode[] = []
    Children.forEach(nodes, (node) => {
      if (isValidElement(node)) {
        if (node.type === React.Fragment) {
          validChildren.push(...extractValidChildren(node.props.children))
        } else {
          validChildren.push(node)
        }
      }
    })
    return validChildren
  }

  const renderActions = () => <>{children}</>

  const renderMenu = () => {
    const validChildren = extractValidChildren(children)

    return (
      <>
        <IconButton onClick={handleMenuOpen}>
          <EllipsisVertical />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          {validChildren.map((child) =>
            isValidElement(child) ? (
              <MenuItem
                key={`${rowId}-${child.props?.label?.toLowerCase() || 'menu-item'}`}
                sx={styles.menuItem}
                onClick={() => {
                  child.props?.handleClick?.()
                  handleMenuClose()
                }}
              >
                {child.props?.label}
              </MenuItem>
            ) : null
          )}
        </Menu>
      </>
    )
  }

  return showInMenu ? renderMenu() : renderActions()
}
