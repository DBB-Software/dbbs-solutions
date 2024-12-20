'use client'

import { Card, CardHeader, CardTitle } from '@dbbs/tailwind-components'
import { useSession } from 'next-auth/react'

const SettingsPage = () => {
  const session = useSession()
  if (!session.data) {
    return <div>Not authenticated</div>
  }
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Protected component client component</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default SettingsPage
