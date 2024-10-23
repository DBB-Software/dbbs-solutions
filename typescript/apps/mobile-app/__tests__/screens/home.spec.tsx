import React from 'react'
import { render, screen } from '@testing-library/react-native'
import fetchMock from 'jest-fetch-mock'
import { HomeComponent } from '../../src/screens/home.screen'

describe('HomeComponent', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })
  it('HomeComponent should render properly with serverless settings', async () => {
    fetchMock.mockIf(/settings/, JSON.stringify({ TENANTS: { TENANT1: {}, TENANT2: {} } }))
    render(<HomeComponent />)
    const tenant1 = await screen.findByText('TENANT1')
    const tenant2 = await screen.findByText('TENANT2')

    expect(tenant1).toBeVisible()
    expect(tenant2).toBeVisible()
    expect(screen.getByText('Serverless Tenants:')).toBeVisible()
  })
  it('HomeComponent should render properly with strapi settings', async () => {
    fetchMock.mockIf(/settings/, JSON.stringify({ settings: { TENANTS: { TENANT1: {}, TENANT2: {} } } }))
    render(<HomeComponent />)
    const tenant1 = await screen.findByText('TENANT1')
    const tenant2 = await screen.findByText('TENANT2')

    expect(tenant1).toBeVisible()
    expect(tenant2).toBeVisible()
    expect(screen.getByText('Strapi Tenants:')).toBeVisible()
  })
})
