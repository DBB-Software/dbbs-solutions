import { type ActionFunction, redirect } from '@remix-run/node'
import { signOut } from '../services/session.server'

export const action: ActionFunction = async ({ request }) => {
  const cookie = await signOut(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': cookie
    }
  })
}
