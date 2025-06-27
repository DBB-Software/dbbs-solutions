import React, { FC, useEffect, useState } from 'react'
import {
  GridColDef,
  GridInitialState,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  useGridApiRef,
  debounce
} from '@dbbs/mui-components'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from '../../ui'
import {
  DEFAULT_STATE,
  deleteView,
  saveView,
  selectAllViews,
  selectCurrentView,
  selectGridState,
  setCurrentView,
  setGridState,
  useCreateTypeMutation,
  useDeleteTypeMutation,
  useGetTypeListQuery,
  useUpdateTypeMutation
} from '../../data-access'
import { Type } from '../../types'
import 'react-toastify/dist/ReactToastify.css'
import { BASE_EDITABLE_FIELD, buildListQuery, displayValidationErrors, renderDefaultActions } from '../../utils'

const NEW_ROW_ID = 'NEW'
const PAGE_FILTER_KEY = 'MEETING_TYPE'

const TABLE_COLUMNS: GridColDef[] = [
  { ...BASE_EDITABLE_FIELD, field: 'id', headerName: 'ID', width: 200 },
  { ...BASE_EDITABLE_FIELD, field: 'name', headerName: 'Name' },
  {
    ...BASE_EDITABLE_FIELD,
    field: 'createdAt',
    headerName: 'Created At',
    type: 'dateTime',
    valueGetter: (value: string) => new Date(value),
    width: 250
  },
  {
    ...BASE_EDITABLE_FIELD,
    field: 'updatedAt',
    headerName: 'Updated At',
    type: 'dateTime',
    valueGetter: (value: string) => new Date(value),
    width: 250
  }
]

export const TypeList: FC = () => {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [newRow, setNewRow] = useState<(Partial<Type> & { isNew: boolean }) | null>(null)

  const dispatch = useDispatch()

  const gridApiRef = useGridApiRef()

  const initialState = useSelector(selectGridState(PAGE_FILTER_KEY))

  const availableViews = useSelector(selectAllViews(PAGE_FILTER_KEY))

  const currentView = useSelector(selectCurrentView(PAGE_FILTER_KEY))

  const currentState = gridApiRef.current.exportState ? gridApiRef.current.exportState() : initialState

  const query = buildListQuery(currentState)

  const { data, isLoading, isFetching } = useGetTypeListQuery(query)

  const [createType, { isLoading: isCreateLoading }] = useCreateTypeMutation()
  const [updateType, { isLoading: isUpdateLoading }] = useUpdateTypeMutation()
  const [deleteType, { isLoading: isDeleteLoading }] = useDeleteTypeMutation()

  const typeList = data?.results

  const isTableLoading = isLoading || isFetching || isCreateLoading || isUpdateLoading || isDeleteLoading

  const handleDeleteClick = (idToDelete: string) => {
    deleteType(idToDelete)
      .unwrap()
      .catch(({ error }) => toast.error(`Delete Meeting Type Error: ${error}`))
  }

  const handleEditClick = (rowId: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [rowId]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (rowId: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [rowId]: { mode: GridRowModes.View } })
  }

  const handleCancelClick = (rowId: GridRowId) => {
    if (rowId === NEW_ROW_ID) {
      setNewRow(null)
    }
    setRowModesModel({
      ...rowModesModel,
      [rowId]: { mode: GridRowModes.View, ignoreModifications: true }
    })
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const onRowUpdate = (updatedRow: Type & { isNew?: boolean }, isNewRow: boolean) => {
    const { id, isNew, ...typeToValidate } = updatedRow

    if (isNewRow) {
      createType(typeToValidate).unwrap().catch(displayValidationErrors)
      setNewRow(null)
    } else {
      const { ...typeToUpdate } = typeToValidate
      updateType({ id, item: typeToUpdate }).unwrap().catch(displayValidationErrors)
    }
  }

  const handleAddClick = () => {
    setNewRow({ id: NEW_ROW_ID, isNew: true })
    setRowModesModel({
      ...rowModesModel,
      [NEW_ROW_ID]: { mode: GridRowModes.Edit }
    })
  }

  const debouncedHandleStateChange = debounce((state: GridInitialState) => {
    dispatch(setGridState({ key: PAGE_FILTER_KEY, state }))
    if (currentView) {
      dispatch(
        saveView({
          key: PAGE_FILTER_KEY,
          viewName: currentView.name,
          state: { ...state, isDefaultView: currentView.name === DEFAULT_STATE }
        })
      )
    }
  }, 100)

  const handleStateChange = () => {
    const state = gridApiRef.current.exportState()
    debouncedHandleStateChange(state)
  }

  const handleCreateView = (viewToCreate: string) => {
    const defaultState = availableViews.find(({ viewName }) => viewName === DEFAULT_STATE)

    dispatch(
      saveView({
        key: PAGE_FILTER_KEY,
        viewName: viewToCreate,
        state: { ...(defaultState?.view || gridApiRef.current.exportState()), isDefaultView: false }
      })
    )
  }

  const handleChangeView = (viewToSelect: string) => {
    dispatch(setCurrentView({ key: PAGE_FILTER_KEY, viewName: viewToSelect }))
  }

  const handleDeleteView = (viewName: string) => {
    if (viewName === currentView.name) dispatch(setCurrentView({ key: PAGE_FILTER_KEY, viewName: DEFAULT_STATE }))
    dispatch(deleteView({ key: PAGE_FILTER_KEY, viewName }))
  }

  const filteredRows = newRow ? [newRow as Type, ...(typeList || [])] : typeList

  const { cursor, count, remaining } = data || {}
  const totalCount = (cursor || 0) + (count || 0) + (remaining || 0)

  useEffect(() => {
    if (!availableViews?.length) {
      const stateToSave = gridApiRef.current.exportState()
      dispatch(
        saveView({ key: PAGE_FILTER_KEY, viewName: DEFAULT_STATE, state: { ...stateToSave, isDefaultView: true } })
      )
    }
  }, [])

  useEffect(() => {
    if (currentView && currentView.state) gridApiRef.current.restoreState(currentView.state)
  }, [currentView, currentView.name, currentView.state, gridApiRef])

  return (
    <DataTable
      tableHeader={'Type List'}
      columns={TABLE_COLUMNS}
      rows={filteredRows || []}
      rowCount={totalCount}
      onRowUpdate={onRowUpdate}
      actions={(params) =>
        renderDefaultActions({
          params,
          rowModesModel,
          handleCancelClick,
          handleSaveClick,
          handleEditClick,
          handleDeleteClick
        })
      }
      rowModesModel={rowModesModel}
      handleRowModesModelChange={handleRowModesModelChange}
      handleAddClick={handleAddClick}
      handleStateChange={handleStateChange}
      initialState={initialState}
      gridApiRef={gridApiRef}
      views={availableViews}
      currentView={currentView.name || DEFAULT_STATE}
      onChangeView={handleChangeView}
      onCreateView={handleCreateView}
      onDeleteView={handleDeleteView}
      loading={isTableLoading}
    />
  )
}
