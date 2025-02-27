import { GridInitialState } from '@mui/x-data-grid'
import { setupStore } from '../../../testUtils/store'
import filtersReducer, {
  setGridState,
  saveView,
  setCurrentView,
  selectGridState,
  selectAllViews,
  selectViewByName,
  selectCurrentView
} from './filters.slice'

const initializeStore = () =>
  setupStore({
    overrideReducer: {
      filters: filtersReducer
    }
  })

const key = 'key1'
const viewName = 'view1'

describe('filtersSlice with store', () => {
  it('should handle setGridState via store dispatch', () => {
    const newState: GridInitialState = { columns: {} }

    const { store } = initializeStore()

    store.dispatch(setGridState({ key, state: newState }))

    const state = store.getState()
    expect(selectGridState(key)(state)).toEqual(newState)
  })

  it('should handle saveView via store dispatch', () => {
    const newState: GridInitialState = { columns: {} }

    const { store } = initializeStore()

    store.dispatch(saveView({ key, viewName, state: newState }))

    const state = store.getState()
    expect(selectViewByName(key, viewName)(state)).toEqual(newState)
  })

  it('should handle setCurrentView via store dispatch', () => {
    const { store } = initializeStore()

    store.dispatch(setCurrentView({ key, viewName }))

    const state = store.getState()
    expect(selectCurrentView(key)(state)).toEqual({ name: 'view1' })
  })

  it('should select all views via store', () => {
    const newState: GridInitialState = { columns: {} }

    const { store } = initializeStore()

    store.dispatch(saveView({ key, viewName, state: newState }))

    const state = store.getState()
    expect(selectAllViews(key)(state)).toEqual([{ isDefaultView: false, view: { columns: {} }, viewName: 'view1' }])
  })
})
