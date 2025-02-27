import './index.css'
import { PasswordlessLogin } from './PasswordlessLogin'
import { EmailPasswordLogin } from './EmailPasswordLogin'

function App() {
  return (
    <div>
      <PasswordlessLogin />
      <hr />
      <EmailPasswordLogin />
    </div>
  )
}

export default App
