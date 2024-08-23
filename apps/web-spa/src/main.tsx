import { StrictMode } from 'react'
import { init } from '@dbbs/web-features/src/sentry/react'
import ReactDOM from 'react-dom/client'
import App from './App'

init()

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
