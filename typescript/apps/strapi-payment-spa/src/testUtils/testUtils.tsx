import { ReactElement, ReactNode } from 'react'
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, theme } from '@dbbs/mui-components'
import { AuthContext, AuthContextType } from '../contexts/AuthContext'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authProviderValue?: AuthContextType
}

const AllTheProviders = ({
  children,
  authProviderValue
}: {
  children: ReactNode
  authProviderValue: AuthContextType
}) => (
  <ThemeProvider theme={theme}>
    <AuthContext.Provider value={authProviderValue}>{children}</AuthContext.Provider>
  </ThemeProvider>
)

const customRender = (
  ui: ReactElement,
  {
    authProviderValue = {
      jwt: null,
      user: null,
      setAuthData: jest.fn(),
      clearAuthData: jest.fn(),
      logout: jest.fn(),
      setUser: jest.fn()
    },
    ...options
  }: CustomRenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } => ({
  user: userEvent.setup(),
  ...rtlRender(ui, { wrapper: ({ children }) => AllTheProviders({ children, authProviderValue }), ...options })
})

export * from '@testing-library/react'
export { customRender as render }
