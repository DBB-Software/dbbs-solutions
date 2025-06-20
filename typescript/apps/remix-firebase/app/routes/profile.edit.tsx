import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@dbbs/tailwind-components'
import { AlertCircle } from 'lucide-react'
import { useFetcher } from '@remix-run/react'
import { useState, type FormEventHandler } from 'react'
import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect, json } from '@remix-run/node'
import { getUserSession, updateUserName } from '../services/session.server'
import { useAppState } from '../store/app'

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUserSession(request)

  if (!user) {
    return json({ message: 'Access denied.' }, { status: 403 })
  }

  const formData = await request.formData()
  const values = Object.fromEntries(formData.entries()) as Record<string, string>

  await updateUserName(user.uid, values.fullName)

  return json({ user: { ...user, displayName: values.fullName } })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserSession(request)

  if (!user) {
    return redirect('/login')
  }

  return null
}

const EditProfile = () => {
  const fetcher = useFetcher()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [{ user }] = useAppState()

  const validateForm = (formData: FormData) => {
    const values = Object.fromEntries(formData.entries()) as Record<string, string>
    const newErrors: Record<string, string> = {}
    if (!values.fullName.trim()) newErrors.fullName = 'Full name is required'
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
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <fetcher.Form className="space-y-4" method="patch" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" defaultValue={user?.name} />
            {errors.fullName && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.fullName}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </fetcher.Form>
      </CardContent>
    </Card>
  )
}

export default EditProfile
