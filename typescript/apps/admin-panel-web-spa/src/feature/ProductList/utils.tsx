import { GridColDef, GridRenderCellParams } from '@dbbs/mui-components'

export const getProductColumnModel = (): GridColDef[] => [
  { field: 'id', headerName: 'ID', width: 100, editable: false },
  { field: 'typeId', headerName: 'Type ID', width: 150, editable: false },
  { field: 'name', headerName: 'Name', width: 250, editable: false },
  { field: 'description', headerName: 'Description', width: 300, editable: false },
  { field: 'price', headerName: 'Price', width: 150, type: 'number', editable: false },
  { field: 'currency', headerName: 'Currency', width: 100, editable: false },
  { field: 'sku', headerName: 'SKU', width: 150, editable: false },
  { field: 'inventoryCount', headerName: 'Inventory Count', width: 150, type: 'number', editable: false },
  { field: 'imageUrl', headerName: 'Image URL', width: 300, editable: false },
  { field: 'isActive', headerName: 'Is Active', width: 150, type: 'boolean', editable: false },
  {
    field: 'createdAt',
    headerName: 'Created At',
    type: 'dateTime',
    valueGetter: (value) => new Date(value),
    width: 200,
    editable: false
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    type: 'dateTime',
    valueGetter: (value) => new Date(value),
    width: 200,
    editable: false
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 300,
    renderCell: (params: GridRenderCellParams) => params.row?.type?.name || '',
    editable: false
  }
]
