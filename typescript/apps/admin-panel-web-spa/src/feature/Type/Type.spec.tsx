import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'

import { TypeList } from './Type'
import { buildTypesPath, mockTypeListResponse, mockType } from '../../data-access'
import { setupStore } from '../../testUtils/store'
import { DATA_TABLE_TEST_IDS } from '../../ui'
import { rootReducer } from '../../store/reducer'
import { mswServer } from '../../testUtils/server'

jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  useNavigate: jest.fn(() => jest.fn()),
  useRouterState: jest.fn(() => ({
    location: { pathname: '/' }
  })),
  Link: ({ to, ...props }: any) => <a href={to} {...props} />
}))

jest.mock('@mui/x-data-grid', () => ({
  ...jest.requireActual('@mui/x-data-grid'),
  useGridApiRef: jest.fn(() => ({ current: { exportState: jest.fn(() => ({})) } })),
  useGridRowSelectionModel: jest.fn(() => ({ selectedIds: [] })),
  useGridRowModesModel: jest.fn(() => ({}))
}))

const { store } = setupStore({ overrideReducer: rootReducer })

const setup = () =>
  render(
    <Provider store={store}>
      <TypeList />
    </Provider>
  )

const newViewName = 'New View'

describe('<TypeList />', () => {
  it('should render data correctly', async () => {
    setup()

    const createViewInput = await screen.findByTestId(DATA_TABLE_TEST_IDS.CREATE_VIEW_INPUT)
    expect(createViewInput).toBeVisible()
    expect(createViewInput).toBeEnabled()

    const createViewButton = await screen.findByTestId(DATA_TABLE_TEST_IDS.CREATE_VIEW_BUTTON)
    expect(createViewButton).toBeVisible()
    expect(createViewButton).toBeEnabled()
    expect(createViewButton).toHaveTextContent('Create View')

    expect(screen.getByTestId(DATA_TABLE_TEST_IDS.VIEWS)).toBeVisible()

    expect(screen.getByTestId(DATA_TABLE_TEST_IDS.getViewTestId('Default'))).toBeVisible()

    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(1)
  })

  it('should add new view', async () => {
    setup()

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const createViewInput = within(screen.getByTestId(DATA_TABLE_TEST_IDS.CREATE_VIEW_INPUT)).getByPlaceholderText(
      'New view name'
    )
    await userEvent.type(createViewInput, newViewName)

    const createViewButton = await screen.findByTestId(DATA_TABLE_TEST_IDS.CREATE_VIEW_BUTTON)
    await userEvent.click(createViewButton)

    await waitFor(() => {
      const newViewElement = screen.getByTestId(DATA_TABLE_TEST_IDS.getViewTestId(newViewName))
      expect(newViewElement).toBeVisible()
      expect(newViewElement).toBeEnabled()
      expect(newViewElement).toHaveTextContent(newViewName)
    })
  })

  it('should delete view', async () => {
    setup()

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const createViewInput = within(screen.getByTestId(DATA_TABLE_TEST_IDS.CREATE_VIEW_INPUT)).getByPlaceholderText(
      'New view name'
    )
    await userEvent.type(createViewInput, newViewName)

    const createViewButton = screen.getByTestId(DATA_TABLE_TEST_IDS.CREATE_VIEW_BUTTON)
    await userEvent.click(createViewButton)

    await waitFor(() => {
      const newViewElement = screen.getByTestId(DATA_TABLE_TEST_IDS.getViewTestId(newViewName))
      expect(newViewElement).toBeVisible()
    })

    const deleteViewButton = screen.getByTestId(DATA_TABLE_TEST_IDS.getDeleteViewButtonTestId(newViewName))
    await userEvent.click(deleteViewButton)

    await waitFor(() =>
      expect(screen.queryByTestId(DATA_TABLE_TEST_IDS.getViewTestId(newViewName))).not.toBeInTheDocument()
    )
  })

  it('should delete row', async () => {
    setup()

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    mswServer.use(
      http.get(
        new RegExp(`${buildTypesPath()}(?!/)`),
        () => new HttpResponse(JSON.stringify({ ...mockTypeListResponse, results: [] }))
      )
    )

    const deleteButton = await screen.findByTestId(DATA_TABLE_TEST_IDS.getDeleteButtonTestId(mockType.id))

    await userEvent.click(deleteButton)

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBe(1)
    })
  })
})
