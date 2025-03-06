import { GridSortDirection } from '@mui/x-data-grid'
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity'

interface QueryParams {
  limit?: number
  offset?: number
  filterField?: string
  filterOperator?: string
  filterValue?: string
  sortBy?: string
  sortOrder?: GridSortDirection
}

export const buildListQuery = (gridState?: GridInitialStateCommunity): QueryParams => {
  // Pagination Options
  const pageSize = gridState?.pagination?.paginationModel?.pageSize
  const currentPage = gridState?.pagination?.paginationModel?.page
  const offset = pageSize && currentPage ? pageSize * currentPage : 0

  // Filter Options
  const currentFilter = gridState?.filter?.filterModel?.items?.[0]
  const filterField = currentFilter?.field
  const filterOperator = currentFilter?.operator
  const filterValue = currentFilter?.value

  // Sorting Options
  const currentSorting = gridState?.sorting?.sortModel?.[0]
  const sortBy = currentSorting?.field
  const sortOrder = currentSorting?.sort

  return {
    limit: pageSize,
    offset,
    filterField,
    filterOperator,
    filterValue,
    sortBy,
    sortOrder
  }
}
