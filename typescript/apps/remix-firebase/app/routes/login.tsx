import { FormEventHandler, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useFetcher } from '@remix-run/react'
import { type ActionFunction, json, redirect } from '@remix-run/node'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@dbbs/tailwind-components'
import { signIn, createUserSession } from '../services/session.server'

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData()
    const values = Object.fromEntries(formData.entries()) as Record<string, string>
    const { user } = await signIn(values.email, values.password)
    const idToken = await user.getIdToken()
    const session = await createUserSession(idToken)

    return redirect('/', {
      headers: {
        'Set-Cookie': session
      }
    })
  } catch (err) {
    return json({ error: true, message: (err as Error).message }, { status: 400 })
  }
}

export default function SignUp() {
  const fetcher = useFetcher()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (formData: FormData) => {
    const values = Object.fromEntries(formData.entries()) as Record<string, string>
    const newErrors: Record<string, string> = {}
    if (!values.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(values.email)) newErrors.email = 'Email is invalid'
    if (!values.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const isValidForm = validateForm(formData)

    if (isValidForm) {
      fetcher.submit(event.currentTarget)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sing In</CardTitle>
      </CardHeader>
      <CardContent>
        <fetcher.Form method="post" onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" />
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Sing In
          </Button>
        </fetcher.Form>
      </CardContent>
    </Card>
  )
}
