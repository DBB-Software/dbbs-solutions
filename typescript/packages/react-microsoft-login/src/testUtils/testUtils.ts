import { ReactElement } from 'react'
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const customRender = (
  ui: ReactElement,
  options: RenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } => ({
  user: userEvent.setup(),
  ...rtlRender(ui, { wrapper: ({ children }) => children, ...options })
})

export * from '@testing-library/react'
export { customRender as render }
