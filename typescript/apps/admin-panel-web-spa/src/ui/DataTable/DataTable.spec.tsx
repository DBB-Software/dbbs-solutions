import React from 'react'
import { GridRowModel } from '@mui/x-data-grid'
import { render } from '@testing-library/react'
import { DataTable, DataTableProps } from './DataTable'
import { mockColumns, mockRows } from './mocks'

const DEFAULT_PROPS: DataTableProps<GridRowModel> = {
  tableHeader: 'Test Table',
  columns: mockColumns,
  rows: mockRows,
  onRowUpdate: jest.fn(),
  rowModesModel: {},
  handleRowModesModelChange: jest.fn(),
  handleAddClick: jest.fn(),
  handleStateChange: jest.fn(),
  views: [],
  onChangeView: jest.fn(),
  onCreateView: jest.fn(),
  onDeleteView: jest.fn(),
  rowCount: 100
}

describe('<DataTable />', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<DataTable {...DEFAULT_PROPS} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
