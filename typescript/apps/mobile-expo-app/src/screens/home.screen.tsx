import React, { useCallback, useEffect, useState } from 'react'
import { Screen, Text } from '@dbbs/mobile-components'
import { useRemoteConfig } from '@dbbs/mobile-firebase'
import { useTranslation } from '@dbbs/react-localization-provider'
import { RemoteConfigValues } from '../app/remote/remote-config-values'

const fetchData = (url?: string) => fetch(`${url}/settings`).then((r) => r.json())

export const HomeComponent = () => {
  const [serverlessTenants, setServerlessTenants] = useState<string[]>([])
  const [strapiTenants, setStrapiTenants] = useState<string[]>([])
  const { test, testNumber, testObject } = useRemoteConfig<RemoteConfigValues>()
  const { t } = useTranslation()

  const renderTenantContent = useCallback((tenant: string) => <Text key={tenant}>{tenant}</Text>, [])

  useEffect(() => {
    fetchData(process.env.EXPO_PUBLIC_MOBILE_APP_SERVERLESS_API_URL).then((settingsResponse) => {
      setServerlessTenants(Object.keys(settingsResponse?.TENANTS ?? {}))
    })
    fetchData(process.env.EXPO_PUBLIC_MOBILE_APP_STRAPI_API_URL).then((settingsResponse) => {
      setStrapiTenants(Object.keys(settingsResponse?.settings?.TENANTS ?? {}))
    })
  }, [])

  return (
    <Screen centred testID="test">
      <Text>{t('common.language')}</Text>
      <Text>Serverless Tenants:</Text>
      {serverlessTenants.map(renderTenantContent)}
      <Text>Strapi Tenants:</Text>
      {strapiTenants.map(renderTenantContent)}
      <Text>Remote config:</Text>
      <Text>
        {test?.value} - {test?.source}
      </Text>
      <Text>
        {testNumber?.value} - {test?.source}
      </Text>
      <Text>
        {testObject?.value?.test} - {test?.source}
      </Text>
    </Screen>
  )
}
