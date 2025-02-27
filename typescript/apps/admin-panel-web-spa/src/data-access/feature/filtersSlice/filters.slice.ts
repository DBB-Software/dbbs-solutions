import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { GridInitialState } from '@mui/x-data-grid'
import { RootState } from '../../../store'

export const FILTERS_SLICE_KEY = 'filters'

export const DEFAULT_STATE = 'Default'

export type DomainGridState = GridInitialState & { isDefaultView?: boolean }

export type FilterState = {
  states: { [key: string]: GridInitialState | undefined }
  views: { [key: string]: { [viewName: string]: DomainGridState } }
  currentView: { [key: string]: string | undefined }
}

export const filtersInitialState: FilterState = {
  states: {},
  views: {},
  currentView: {}
}

export const filtersSlice = createSlice({
  name: FILTERS_SLICE_KEY,
  initialState: filtersInitialState,
  reducers: {
    setGridState(state, action: PayloadAction<{ key: string; state: GridInitialState }>) {
      state.states[action.payload.key] = { ...action.payload.state, preferencePanel: undefined }
    },
    saveView(state, action: PayloadAction<{ key: string; viewName: string; state: DomainGridState }>) {
      const { key, viewName, state: newState } = action.payload

      if (!state.views[key]) {
        state.views[key] = {}
      }

      state.views[key][viewName] = { ...newState, preferencePanel: undefined }
    },
    deleteView(state, action: PayloadAction<{ key: string; viewName: string }>) {
      const { key, viewName } = action.payload

      delete state.views?.[key][viewName]
    },
    setCurrentView(state, action: PayloadAction<{ key: string; viewName: string }>) {
      const { key, viewName } = action.payload
      if (!state.currentView) {
        state.currentView = {}
      }

      state.currentView[key] = viewName
    }
  }
})

export const selectFilterState = (state: RootState) => state[FILTERS_SLICE_KEY]

export const selectGridState = (key: string) =>
  createSelector(selectFilterState, (gridState) => gridState?.states?.[key])

export const selectAllViews = (key: string) =>
  createSelector(selectFilterState, (gridState) => {
    const views = gridState?.views?.[key] || {}
    return Object.entries(views)
      .map(([viewName, viewState]) => ({
        viewName,
        view: viewState,
        isDefaultView: !!viewState.isDefaultView
      }))
      .sort((a, b) => (b.isDefaultView ? 1 : 0) - (a.isDefaultView ? 1 : 0))
  })

export const selectViewByName = (key: string, viewName: string) =>
  createSelector(selectFilterState, (gridState) => gridState.views[key]?.[viewName])

export const selectCurrentView = (key: string) =>
  createSelector(selectFilterState, (geoState) => {
    const viewName = geoState.currentView?.[key] || DEFAULT_STATE
    return { state: geoState.views[key]?.[viewName], name: viewName }
  })

export const { setGridState, saveView, deleteView, setCurrentView } = filtersSlice.actions

export default filtersSlice.reducer
