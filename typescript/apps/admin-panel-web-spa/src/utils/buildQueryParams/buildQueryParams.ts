import { GridSortDirection } from '@dbbs/mui-components'

type QueryParams = Record<string, number | string | boolean | GridSortDirection | undefined | null>

export const buildQueryParams = (params: QueryParams): URLSearchParams => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString())
    }
  })

  return searchParams
}
