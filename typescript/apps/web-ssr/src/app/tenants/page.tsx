const fetchData = (url?: string) => fetch(`${url}/settings`).then((r) => r.json())

const fetchTenants = async () => {
  const serverlessTenants = await fetchData(process.env.SERVERLESS_API_URL).then((settingsResponse) =>
    Object.keys(settingsResponse?.TENANTS ?? {})
  )
  const strapiTenants = await fetchData(process.env.STRAPI_API_URL).then((settingsResponse) =>
    Object.keys(settingsResponse?.settings?.TENANTS ?? {})
  )

  return { serverlessTenants, strapiTenants } as const
}

const renderTenantContent = (tenant: string) => (
  <li key={tenant} className="text-secondary-foreground first:mt-1 mt-3">
    {tenant}
  </li>
)

const TenantsPage = async () => {
  const { serverlessTenants, strapiTenants } = await fetchTenants()

  return (
    <div className="p-3">
      <h3 className="mt-3">Serverless Tenants:</h3>
      <ul>{serverlessTenants.map(renderTenantContent)}</ul>
      <h3 className="mt-3">Strapi Tenants:</h3>
      <ul>{strapiTenants.map(renderTenantContent)}</ul>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default TenantsPage
