import { ReactElement } from 'react'
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'>

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult & { user: ReturnType<typeof userEvent.setup> } => {
  const user = userEvent.setup()

  return {
    user,
    ...rtlRender(ui, { ...options })
  }
}

export * from '@testing-library/react'
export { customRender as render }
