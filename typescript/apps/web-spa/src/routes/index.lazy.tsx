import { createLazyFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@dbbs/tailwind-components'

const fetchData = (url?: string) => fetch(`${url}/settings`).then((r) => r.json())

export const Index = () => {
  const [serverlessTenants, setServerlessTenants] = useState<string[]>([])
  const [strapiTenants, setStrapiTenants] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const renderTenantContent = useCallback(
    (tenant: string) => (
      <li key={tenant} className="text-secondary-foreground first:mt-1 mt-3">
        {tenant}
      </li>
    ),
    []
  )

  useEffect(() => {
    Promise.all([fetchData(process.env.WEB_APP_SERVERLESS_API_URL), fetchData(process.env.WEB_APP_STRAPI_API_URL)])
      .then(([serverlessResponse, strapiResponse]) => {
        setServerlessTenants(Object.keys(serverlessResponse?.TENANTS ?? {}))
        setStrapiTenants(Object.keys(strapiResponse?.settings?.TENANTS ?? {}))
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div className="p-3">
      <Button
        onClick={() => {
          throw new Error('sentry spa error')
        }}
      >
        Sample APP
      </Button>
      <h3 className="mt-3">Serverless Tenants:</h3>
      <ul>{serverlessTenants.map(renderTenantContent)}</ul>
      <h3 className="mt-3">Strapi Tenants:</h3>
      <ul>{strapiTenants.map(renderTenantContent)}</ul>
    </div>
  )
}

export const Route = createLazyFileRoute('/')({
  component: () => <Index />
})
