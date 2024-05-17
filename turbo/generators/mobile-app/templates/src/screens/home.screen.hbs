import React, { useCallback, useEffect, useState } from 'react'
import Config from 'react-native-config'
import { Screen, Text } from '@dbbs/mobile-components'

const fetchData = (url?: string) => fetch(`${url}/settings`).then((r) => r.json())

export const HomeComponent = () => {
  const [serverlessTenants, setServerlessTenants] = useState<string[]>([])
  const [strapiTenants, setStrapiTenants] = useState<string[]>([])

  const renderTenantContent = useCallback((tenant: string) => <Text key={tenant}>{tenant}</Text>, [])

  useEffect(() => {
    fetchData(Config.MOBILE_APP_SERVERLESS_API_URL).then((settingsResponse) => {
      setServerlessTenants(Object.keys(settingsResponse?.TENANTS ?? {}))
    })
    fetchData(Config.MOBILE_APP_STRAPI_API_URL).then((settingsResponse) => {
      setStrapiTenants(Object.keys(settingsResponse?.settings?.TENANTS ?? {}))
    })
  }, [])

  return (
    <Screen centred testID="test">
      <Text>Serverless Tenants:</Text>
      {serverlessTenants.map(renderTenantContent)}
      <Text>Strapi Tenants:</Text>
      {strapiTenants.map(renderTenantContent)}
    </Screen>
  )
}
