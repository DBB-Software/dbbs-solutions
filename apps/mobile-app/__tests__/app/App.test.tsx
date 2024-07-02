import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import fetchMock from 'jest-fetch-mock'
import { App } from '../../src/app'

describe('App', () => {
  beforeAll(() => {
    fetchMock.resetMocks()
  })
  it('should render properly', async () => {
    fetchMock.mockIf(/settings/, JSON.stringify({}))
    const { getByTestId } = render(<App />)

    await waitFor(() => {
      const appComponent = getByTestId('test')
      expect(appComponent).toBeDefined()
      expect(appComponent).toBeVisible()
    })
  })
})
