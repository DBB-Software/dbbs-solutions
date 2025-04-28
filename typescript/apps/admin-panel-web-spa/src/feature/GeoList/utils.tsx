import React from 'react'
import { GridColDef, GridRenderCellParams } from '@dbbs/mui-components'
import moment from 'moment-timezone'
import { Link } from '@tanstack/react-router'

export const getGeoColumnModel = (): GridColDef[] => [
  { field: 'id', headerName: 'ID', editable: false },
  { field: 'bubbleId', headerName: 'Bubble ID', width: 250, editable: false },
  { field: 'name', headerName: 'Name', width: 250, editable: false },
  {
    field: 'geoType',
    headerName: 'Geo Type',
    width: 150,
    editable: false
  },
  {
    field: 'timezone',
    headerName: 'Time Zone',
    width: 200,
    type: 'singleSelect',
    valueOptions: moment.tz.names(),
    editable: false
  },
  { field: 'createdBy', headerName: 'Created By', width: 250, editable: false },
  {
    field: 'createdDate',
    headerName: 'Created Date',
    type: 'dateTime',
    valueGetter: (value: string) => new Date(value),
    width: 200,
    editable: false
  },
  {
    field: 'modifiedDate',
    headerName: 'Modified Date',
    type: 'dateTime',
    valueGetter: (value: string) => new Date(value),
    width: 200,
    editable: false
  },
  { field: 'scheduleUrl', headerName: 'Schedule URL', width: 350, editable: false },
  {
    field: 'captureScheduleFlag',
    headerName: 'Capture Schedule',
    type: 'boolean',
    width: 150,
    editable: false
  },
  { field: 'captureStreamFlag', headerName: 'Capture Stream', type: 'boolean', width: 150, editable: false },
  { field: 'scheduleFormat', headerName: 'Schedule Format', width: 150, editable: false },
  { field: 'streamType', headerName: 'Stream Type', width: 150, editable: false },
  {
    field: 'jurisdiction',
    headerName: 'Jurisdiction',
    width: 100,
    type: 'boolean',
    editable: false
  },
  {
    editable: false,
    field: 'parent',
    headerName: 'Parent',
    width: 300,
    renderCell: (params: GridRenderCellParams) => (
      <Link to={`/geo/${params.row?.parent?.id}/edit`} target="_blank">
        {params.row?.parent?.fullName || params.row?.parent?.name || ''}
      </Link>
    )
  },
  { field: 'sortKey', headerName: 'Sort Key', width: 300, editable: false },
  { field: 'channelUrl', headerName: 'Channel URL', width: 300, editable: false },
  { field: 'statusSchedule', headerName: 'Schedule Status', width: 150, editable: false },
  { field: 'mirrorGeo', headerName: 'Mirror Geo ID', width: 300, editable: false },
  { field: 'bubbleId', headerName: 'Bubble ID', width: 150, editable: false },
  { field: 'geoParentId', headerName: 'Geo Parent ID', width: 150, editable: false },
  { field: 'detectStartMethod', headerName: 'Detect Start Method', width: 200, editable: false },
  { field: 'detectEndMethod', headerName: 'Detect End Method', width: 200, editable: false },
  { field: 'statusStream', headerName: 'Status Stream', width: 150, editable: false },
  { field: 'flagOnlyAgenda', headerName: 'Flag Only Agenda', type: 'boolean', width: 150, editable: false },
  { field: 'flagOptInOnly', headerName: 'Flag Opt-In Only', type: 'boolean', width: 150, editable: false },
  { field: 'singlePlayerUrl', headerName: 'Single Player URL', width: 300, editable: false },
  { field: 'flagLive', headerName: 'Flag Live', type: 'boolean', width: 150, editable: false },
  { field: 'detectEndOcrString', headerName: 'Detect End OCR String', width: 200, editable: false },
  { field: 'debug', headerName: 'Debug', type: 'boolean', width: 100, editable: false },
  { field: 'demo', headerName: 'Demo', type: 'boolean', width: 100, editable: false },
  { field: 'scheduleRefreshFrequency', headerName: 'Schedule Refresh Frequency', width: 200, editable: false }
]
