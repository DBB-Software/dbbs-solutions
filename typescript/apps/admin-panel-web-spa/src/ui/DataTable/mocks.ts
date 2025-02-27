import { GridColDef, GridRowModel } from '@dbbs/mui-components'

const mockDate = new Date('2024-01-01')

export const mockRow: GridRowModel = {
  id: 1,
  name: 'Test',
  age: 25,
  joinDate: mockDate,
  role: 'Market',
  flex: 1
}

export const mockRows: GridRowModel[] = [
  {
    ...mockRow
  },
  {
    ...mockRow,
    id: 2,
    age: 36,
    role: 'Finance'
  },
  {
    ...mockRow,
    id: 3,
    age: 19,
    role: 'Development'
  },
  {
    ...mockRow,
    id: 4,
    age: 28,
    role: 'Market'
  },
  {
    ...mockRow,
    id: 5,
    age: 23,
    role: 'Finance'
  }
]

export const mockColumns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 80,
    align: 'left',
    headerAlign: 'left',
    editable: true
  },
  {
    field: 'joinDate',
    headerName: 'Join date',
    type: 'date',
    width: 180,
    editable: true
  },
  {
    field: 'role',
    headerName: 'Department',
    width: 220,
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Market', 'Finance', 'Development']
  }
]
