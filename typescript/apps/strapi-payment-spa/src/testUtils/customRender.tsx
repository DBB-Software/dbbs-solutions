import { render, type RenderResult, type RenderOptions } from '@testing-library/react'
import { createRouter, RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import { routeTree } from '../routes'

export const renderRouter = async (
  { path }: { path: string },
  options?: Omit<RenderOptions, 'queries'>
): Promise<RenderResult> => {
  const memoryHistory = createMemoryHistory({
    initialEntries: [path]
  })
  const router = createRouter({ routeTree, history: memoryHistory })

  return render(<RouterProvider router={router} />, options)
}

export * from '@testing-library/react'
