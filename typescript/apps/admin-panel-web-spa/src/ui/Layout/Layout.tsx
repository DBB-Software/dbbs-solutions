import React, { FC, ReactNode, useState } from 'react'
import { AppBar, CssBaseline, Drawer, IconButton, Box, useMediaQuery, Typography, Divider } from '@dbbs/mui-components'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { SIDEBAR_DATA_PAGES_LINKS, makeSxStyles } from '../../utils'
import theme from '../../theme'
import { SidebarLink } from '../SidebarLink'

export type LayoutProps = {
  children?: ReactNode
}

const makeStyles = () =>
  makeSxStyles({
    root: {
      display: 'flex'
    },
    header: {
      position: 'fixed',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: 'white',
      px: 2,
      height: 48,
      zIndex: theme.zIndex.drawer + 1
    },
    menuButton: { mr: 2 },
    sidebarRoot: {
      width: { md: 240 },
      flexShrink: { md: 0 }
    },
    sidebarDrawer: {
      display: { xs: 'none', md: 'block' },
      '& .MuiDrawer-paper': {
        minWidth: 240
      }
    },
    sidebarMobileDrawer: {
      display: { xs: 'block', md: 'none' },
      '& .MuiDrawer-paper': { minWidth: 240, pt: 6 }
    },
    contentWrapper: {
      flexGrow: 1,
      p: 3,
      mt: {
        md: 0,
        xs: 6
      },
      width: 'auto'
    },
    menuContentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexGrow: 1
    },
    navigationLink: {
      textDecoration: 'none',
      fontWeight: 'bold',
      color: theme.palette.primary
    },
    contentRoot: {
      flexGrow: 1,
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    },
    logo: {
      textDecoration: 'none'
    }
  })

export const Layout: FC<LayoutProps> = ({ children }) => {
  const styles = makeStyles()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [mobileOpen, setMobileOpen] = useState(false)

  const router = useRouterState()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawerContent = (
    <Box sx={styles.contentRoot}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography typography="h3" alignContent="center">
          LOGO
        </Typography>
      </Link>
      <Divider />

      <Box sx={styles.menuContentWrapper}>
        <Box>
          {SIDEBAR_DATA_PAGES_LINKS.map((linkItem) => (
            <SidebarLink {...linkItem} isActive={router.location.pathname === linkItem.link} key={linkItem.key} />
          ))}
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={styles.root}>
      <CssBaseline />
      {isMobile && (
        <AppBar sx={styles.header}>
          <IconButton edge="start" onClick={handleDrawerToggle} sx={styles.menuButton}>
            <Menu />
          </IconButton>
        </AppBar>
      )}

      <Box sx={styles.sidebarRoot}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={!isMobile || mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={styles.sidebarMobileDrawer}
        >
          {drawerContent}
        </Drawer>

        <Drawer variant="permanent" sx={styles.sidebarDrawer} open>
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={styles.contentWrapper}>
        {children}
      </Box>
    </Box>
  )
}
