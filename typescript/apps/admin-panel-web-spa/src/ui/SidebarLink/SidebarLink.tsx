import React, { FC } from 'react'
import { Link } from '@tanstack/react-router'
import { ListItemButton, ListItemIcon, Typography } from '@mui/material'
import { makeSxStyles, NavigationLink } from '../../utils'
import theme from '../../theme'

export type SidebarLinkProps = NavigationLink & { isActive: boolean }

const makeStyles = () =>
  makeSxStyles({
    listIcon: {
      minWidth: 30,
      svg: {
        width: 20
      },
      color: 'inherit'
    },
    sidebarLink: {
      fontSize: 14
    },
    iconWrapper: {
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })

export const SidebarLink: FC<SidebarLinkProps> = ({ link, icon, label, isActive }) => {
  const styles = makeStyles()

  return (
    <Link
      style={{
        textDecoration: 'none',
        color: 'inherit'
      }}
      to={link}
    >
      <ListItemButton
        sx={{
          backgroundColor: isActive ? theme.palette.secondary.light : undefined
        }}
      >
        <ListItemIcon sx={styles.listIcon}>{icon}</ListItemIcon>
        <Typography sx={styles.sidebarLink}>{label}</Typography>
      </ListItemButton>
    </Link>
  )
}
