import { createRemixStub } from '@remix-run/testing'
import { render, screen, waitFor } from '@testing-library/react'
import Index from '../app/routes/_index'
import { mockedRedditPost } from './testUtils/mocks'

jest.mock('@remix-run/react', () => ({
  ...jest.requireActual('@remix-run/react'),
  useLoaderData: jest.fn(() => ({
    reddits: [mockedRedditPost]
  }))
}))

describe('App', () => {
  it('should render properly', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Index
      }
    ])

    render(<RemixStub />)

    await waitFor(() => screen.findByText('Hello from Remix!'))
  })
})
