import React, { ReactNode } from 'react'
import { MapPin, Users } from 'lucide-react'
import { GridColDef } from '@dbbs/mui-components'

export const BASE_EDITABLE_FIELD: Partial<GridColDef> = {
  width: 150,
  editable: true
}

export type NavigationLink = {
  label: string
  key: string
  link: string
  icon?: ReactNode
}

export const DEFAULT_CONFIG_PAGE_GRID_SIZE = { xs: 12, md: 6 }

export const SIDEBAR_DATA_PAGES_LINKS: NavigationLink[] = [
  {
    label: 'Geo',
    link: '/geo',
    key: 'geo',
    icon: <MapPin />
  },
  {
    label: 'Meeting Type',
    link: '/meeting-type',
    key: 'meetingType',
    icon: <Users />
  }
]
