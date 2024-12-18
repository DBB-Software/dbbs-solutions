import { Button, Card, CardContent, CardHeader, CardTitle } from '@dbbs/tailwind-components'
import { signIn } from '../../auth'

export default function Login() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sing In</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={async () => {
            'use server'

            await signIn('auth0', { redirectTo: '/' })
          }}
        >
          <Button type="submit" className="w-full">
            Signin with Auth0
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
