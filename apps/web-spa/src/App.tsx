import { useCallback, useEffect, useState } from 'react'
import { Button } from '@dbbs/tailwind-components'
import './index.css'

const fetchData = (url?: string) => fetch(`${url}/settings`).then((r) => r.json())

function App() {
  const [serverlessTenants, setServerlessTenants] = useState<string[]>([])
  const [strapiTenants, setStrapiTenants] = useState<string[]>([])

  const renderTenantContent = useCallback(
    (tenant: string) => (
      <li key={tenant} className="text-secondary-foreground first:mt-1 mt-3">
        {tenant}
      </li>
    ),
    []
  )

  useEffect(() => {
    fetchData(process.env.WEB_APP_SERVERLESS_API_URL).then((settingsResponse) => {
      setServerlessTenants(Object.keys(settingsResponse?.TENANTS ?? {}))
    })
    fetchData(process.env.WEB_APP_STRAPI_API_URL).then((settingsResponse) => {
      setStrapiTenants(Object.keys(settingsResponse?.settings?.TENANTS ?? {}))
    })
  }, [])
  return (
    <div className="p-3">
      <Button>Sample APP</Button>
      <h3 className="mt-3">Serverless Tenants:</h3>
      <ul>{serverlessTenants.map(renderTenantContent)}</ul>
      <h3 className="mt-3">Strapi Tenants:</h3>
      <ul>{strapiTenants.map(renderTenantContent)}</ul>
    </div>
  )
}

export default App
