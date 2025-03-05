import { GridSortDirection } from '@mui/x-data-grid'
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity'
import { buildListQuery } from './buildListQuery'

describe('buildListQuery', () => {
  it('should return correct query params for a fully populated grid state', () => {
    const gridState: GridInitialStateCommunity = {
      pagination: {
        paginationModel: {
          pageSize: 10,
          page: 2
        }
      },
      filter: {
        filterModel: {
          items: [
            {
              field: 'name',
              operator: 'contains',
              value: 'John'
            }
          ]
        }
      },
      sorting: {
        sortModel: [
          {
            field: 'name',
            sort: 'asc' as GridSortDirection
          }
        ]
      }
    }

    const result = buildListQuery(gridState)

    expect(result).toEqual({
      limit: 10,
      offset: 20,
      filterField: 'name',
      filterOperator: 'contains',
      filterValue: 'John',
      sortBy: 'name',
      sortOrder: 'asc'
    })
  })

  it('should handle missing filter and sorting configurations', () => {
    const gridState: GridInitialStateCommunity = {
      pagination: {
        paginationModel: {
          pageSize: 5,
          page: 1
        }
      }
    }

    const result = buildListQuery(gridState)

    expect(result).toEqual({
      limit: 5,
      offset: 5
    })
  })

  it('should handle missing pagination configuration', () => {
    const gridState: GridInitialStateCommunity = {
      filter: {
        filterModel: {
          items: [
            {
              field: 'age',
              operator: 'equals',
              value: '30'
            }
          ]
        }
      },
      sorting: {
        sortModel: [
          {
            field: 'age',
            sort: 'desc' as GridSortDirection
          }
        ]
      }
    }

    const result = buildListQuery(gridState)

    expect(result).toEqual({
      offset: 0,
      filterField: 'age',
      filterOperator: 'equals',
      filterValue: '30',
      sortBy: 'age',
      sortOrder: 'desc'
    })
  })

  it('should return default values for undefined grid state', () => {
    const result = buildListQuery(undefined)

    expect(result).toEqual({
      offset: 0
    })
  })

  it('should handle empty grid state gracefully', () => {
    const result = buildListQuery({} as GridInitialStateCommunity)

    expect(result).toEqual({
      offset: 0
    })
  })
})
