import React, { FC, useEffect, useState } from 'react'
import {
  GridInitialState,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  useGridApiRef,
  debounce
} from '@dbbs/mui-components'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
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
  useDeleteGeoMutation,
  useGetGeoListQuery
} from '../../data-access'
import 'react-toastify/dist/ReactToastify.css'
import { getGeoColumnModel } from './utils'
import { buildListQuery, displayValidationErrors, renderDefaultActions } from '../../utils'

const PAGE_FILTER_KEY = 'GEO'

export const GeoList: FC = () => {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const navigate = useNavigate({ from: '/geo' })

  const dispatch = useDispatch()

  const gridApiRef = useGridApiRef()

  const initialState = useSelector(selectGridState(PAGE_FILTER_KEY))

  const availableViews = useSelector(selectAllViews(PAGE_FILTER_KEY))

  const currentView = useSelector(selectCurrentView(PAGE_FILTER_KEY))

  const currentState = gridApiRef.current.exportState ? gridApiRef.current.exportState() : initialState

  const query = buildListQuery(currentState)

  const { data, isLoading, isFetching } = useGetGeoListQuery(query)

  const [deleteGeo, { isLoading: isDeleteLoading }] = useDeleteGeoMutation()

  const geoList = data?.results

  const tableColumns = getGeoColumnModel()

  const isTableLoading = isLoading || isFetching || isDeleteLoading

  const handleDeleteClick = (idToDelete: string) => {
    deleteGeo(idToDelete).unwrap().catch(displayValidationErrors)
  }

  const handleEditClick = (rowId: GridRowId) => {
    navigate({ to: `/geo/${rowId}/edit` })
  }

  const handleSaveClick = (rowId: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [rowId]: { mode: GridRowModes.View } })
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const handleAddClick = () => {
    navigate({ to: '/geo/create' })
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

  const { cursor, count, remaining } = data || {}
  const totalCount = (cursor || 0) + (count || 0) + (remaining || 0)

  useEffect(() => {
    if (!availableViews?.length) {
      const stateToSave = gridApiRef.current.exportState()
      dispatch(
        saveView({ key: PAGE_FILTER_KEY, viewName: DEFAULT_STATE, state: { ...stateToSave, isDefaultView: true } })
      )
    }
  }, [availableViews?.length, dispatch, gridApiRef])

  useEffect(() => {
    if (currentView && currentView.state) {
      gridApiRef.current.restoreState(currentView.state)
    }
  }, [currentView, currentView.name, currentView.state, gridApiRef])

  return (
    <DataTable
      tableHeader={'Geo List'}
      columns={tableColumns}
      rows={geoList || []}
      rowCount={totalCount}
      actions={(params) =>
        renderDefaultActions({
          params,
          rowModesModel,
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
