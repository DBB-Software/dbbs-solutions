import { buildQueryParams } from './buildQueryParams'

describe('buildQueryParams', () => {
  it('should build query with all parameters', () => {
    const params = {
      limit: 10,
      offset: 20,
      filterField: 'name',
      filterOperator: 'eq',
      filterValue: 'test',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }

    const result = buildQueryParams(params)
    expect(result.toString()).toBe(
      'limit=10&offset=20&filterField=name&filterOperator=eq&filterValue=test&sortBy=createdAt&sortOrder=desc'
    )
  })

  it('should build query with only limit and offset', () => {
    const params = {
      limit: 10,
      offset: 20
    }

    const result = buildQueryParams(params)
    expect(result.toString()).toBe('limit=10&offset=20')
  })

  it('should build query with only filter parameters', () => {
    const params = {
      filterField: 'name',
      filterOperator: 'eq',
      filterValue: 'test'
    }

    const result = buildQueryParams(params)
    expect(result.toString()).toBe('filterField=name&filterOperator=eq&filterValue=test')
  })

  it('should build query with only sort parameters', () => {
    const params = {
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }

    const result = buildQueryParams(params)
    expect(result.toString()).toBe('sortBy=createdAt&sortOrder=desc')
  })

  it('should build query with no parameters', () => {
    const params = {}

    const result = buildQueryParams(params)
    expect(result.toString()).toBe('')
  })

  it('should build query with boolean parameters', () => {
    const params = {
      isActive: true,
      isAdmin: false
    }

    const result = buildQueryParams(params)
    expect(result.toString()).toBe('isActive=true&isAdmin=false')
  })

  it('should ignore undefined parameters', () => {
    const params = {
      limit: 10,
      offset: undefined,
      filterField: 'name'
    }

    const result = buildQueryParams(params)
    expect(result.toString()).toBe('limit=10&filterField=name')
  })
})
