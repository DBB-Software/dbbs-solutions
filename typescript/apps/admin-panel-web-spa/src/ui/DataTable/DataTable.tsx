import React, { MutableRefObject, ReactNode, useState } from 'react'
import { CircleX } from 'lucide-react'
import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridSlots,
  GridRowSelectionModel,
  GridValidRowModel,
  GridInitialState,
  GridEventListener,
  GridRowEditStopReasons,
  GridRenderCellParams,
  GridRowClassNameParams,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Icon,
  GridApiCommunity,
  GridTreeNodeWithRender
} from '@dbbs/mui-components'

import { makeSxStyles } from '../../utils'
import theme from '../../theme'
import { EditToolbar } from './Toolbar'
import { DATA_TABLE_TEST_IDS } from './testIds'

const makeStyles = () =>
  makeSxStyles({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
    tableRoot: {
      height: {
        xs: 'calc(100vh - 250px)',
        md: 'calc(100vh - 200px)'
      },
      mt: 1,
      width: {
        xs: 'calc(100vw - 48px)',
        md: 'calc(100vw - 288px)'
      },
      backgroundColor: theme.palette.background.paper
    },
    tableData: { p: 3 },
    createViewContainer: {
      display: 'flex',
      alignItems: 'center',
      pt: 1,
      mb: theme.spacing(1)
    },
    createViewInput: {
      mr: theme.spacing(1)
    },
    tabs: {
      height: 40,
      minHeight: 40
    },
    tab: {
      height: 40,
      minHeight: 40,
      textTransform: 'none'
    },
    deleteTabIcon: {
      display: 'flex',
      borderRadius: '50%',
      ':hover': {
        backgroundColor: theme.palette.grey['100']
      }
    }
  })

const MAX_VIEW_NAME_LENGTH = 32

export interface DataTableProps<T> {
  tableHeader: string
  columns: GridColDef[]
  rows: T[]
  rowModesModel: GridRowModesModel
  onRowUpdate?: (updatedRow: T, isNewRow: boolean) => void
  actions?: (params: GridRenderCellParams<GridValidRowModel, T, T, GridTreeNodeWithRender>) => ReactNode
  handleRowModesModelChange?: (rowModesModel: GridRowModesModel) => void
  handleAddClick?: () => void
  handleStateChange: () => void
  initialState?: GridInitialState
  gridApiRef?: MutableRefObject<GridApiCommunity>
  views: { viewName: string; isDefaultView?: boolean }[]
  currentView?: string
  rowCount?: number
  loading?: boolean
  showAddButton?: boolean
  getRowClassName?: (params: GridRowClassNameParams) => string
  onChangeView: (viewName: string) => void
  onCreateView: (viewName: string) => void
  onDeleteView: (viewName: string) => void
}

export const DataTable = <T extends GridValidRowModel>({
  columns,
  rows,
  tableHeader,
  rowModesModel,
  initialState,
  gridApiRef,
  onRowUpdate,
  handleRowModesModelChange,
  handleAddClick,
  handleStateChange,
  views,
  currentView,
  rowCount,
  loading,
  showAddButton,
  onChangeView,
  onCreateView,
  onDeleteView,
  actions,
  getRowClassName
}: DataTableProps<T>) => {
  const styles = makeStyles()
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [newViewName, setNewViewName] = useState<string>('')

  const processRowUpdate = (newRow: T) => {
    const updatedRow = { ...newRow, isNew: false }
    onRowUpdate?.(newRow, newRow?.isNew)
    return updatedRow
  }

  const handleDeleteSelectedClick = () => {}

  const handleRowCheckBoxSelection = (selectedIds: GridRowSelectionModel) => {
    setSelectedRows([...new Set(selectedIds)].map(Number))
  }

  const handleCreateViewClick = () => {
    if (newViewName.trim()) {
      onCreateView(newViewName.trim())
      setNewViewName('')
    }
  }

  const handleViewChange = (_: unknown, newValue: string) => {
    onChangeView(newValue)
  }

  const handleFilterChange = () => {
    gridApiRef?.current.setPage(0)
    handleStateChange()
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const columnsWithActions: GridColDef[] = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'actions',
      renderCell: actions
    },
    ...columns
  ]

  return (
    <Box sx={styles.root}>
      <Typography typography="h4" data-testid={DATA_TABLE_TEST_IDS.HEADER}>
        {tableHeader}
      </Typography>
      <Box sx={styles.createViewContainer}>
        <TextField
          value={newViewName}
          onChange={(e) => setNewViewName(e.target.value)}
          placeholder="New view name"
          sx={styles.createViewInput}
          data-testid={DATA_TABLE_TEST_IDS.CREATE_VIEW_INPUT}
          size="small"
          multiline={false}
          inputProps={{ maxLength: MAX_VIEW_NAME_LENGTH }}
        />
        <Button
          variant="contained"
          onClick={handleCreateViewClick}
          data-testid={DATA_TABLE_TEST_IDS.CREATE_VIEW_BUTTON}
        >
          Create View
        </Button>
      </Box>
      <Tabs value={currentView} sx={styles.tabs} data-testid={DATA_TABLE_TEST_IDS.VIEWS} onChange={handleViewChange}>
        {views.map(({ viewName, isDefaultView }: { viewName: string; isDefaultView?: boolean }) => (
          <Tab
            key={viewName}
            label={viewName}
            sx={styles.tab}
            value={viewName}
            data-testid={DATA_TABLE_TEST_IDS.getViewTestId(viewName)}
            icon={
              isDefaultView ? undefined : (
                <Icon
                  sx={styles.deleteTabIcon}
                  data-testid={DATA_TABLE_TEST_IDS.getDeleteViewButtonTestId(viewName)}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteView(viewName)
                  }}
                >
                  <CircleX />
                </Icon>
              )
            }
            iconPosition="end"
          />
        ))}
      </Tabs>
      <Box sx={styles.tableRoot}>
        <DataGrid
          apiRef={gridApiRef}
          rows={rows}
          rowCount={rowCount}
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          columns={columnsWithActions}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowEditStop={handleRowEditStop}
          onRowModesModelChange={handleRowModesModelChange}
          onRowSelectionModelChange={handleRowCheckBoxSelection}
          processRowUpdate={processRowUpdate}
          onPaginationModelChange={handleStateChange}
          onDensityChange={handleStateChange}
          onSortModelChange={handleStateChange}
          onColumnWidthChange={handleStateChange}
          onColumnVisibilityModelChange={handleStateChange}
          onFilterModelChange={handleFilterChange}
          sx={styles.tableData}
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar']
          }}
          slotProps={{
            toolbar: {
              handleAddClick,
              handleDeleteSelectedClick,
              selectedRows,
              showAddButton
            }
          }}
          initialState={initialState}
          loading={loading}
          getRowClassName={getRowClassName}
        />
      </Box>
    </Box>
  )
}
