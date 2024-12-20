import React, { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Box, Typography } from '@dbbs/mui-components'
import { getOrganization } from '../../api/stripe-payment.api'
import { Organization, Subscription, User } from '../../interfaces'
import { OrganizationInfoBlock, OrganizationUsersBlock, SubscriptionBlock } from '../../components/organization'

const OrganizationDetailPage: React.FC = () => {
  const { organizationId } = useParams({ from: '/layout/organizations/$organizationId' })
  const [organization, setOrganization] = useState<Organization | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgData = await getOrganization(organizationId)
        setOrganization(orgData)
      } catch (error) {
        console.error('Failed to fetch organization', error)
      }
    }

    fetchData()
  }, [organizationId])

  const handleOrganizationUpdate = (updatedOrganization: Organization) => {
    setOrganization(updatedOrganization)
  }

  const handleUserUpdate = (updatedUsers: User[]) => {
    if (organization) {
      const updatedOrganization = { ...organization, users: updatedUsers }
      setOrganization(updatedOrganization)
    }
  }

  const handleSubscriptionUpdate = (updatedSubscription: Partial<Subscription>) => {
    if (organization) {
      const updatedOrganization = {
        ...organization,
        subscription: { ...organization.subscription, ...updatedSubscription }
      }
      setOrganization(updatedOrganization)
    }
  }

  if (!organization) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box padding="2rem">
      <OrganizationInfoBlock organization={organization} onUpdate={handleOrganizationUpdate} />
      <OrganizationUsersBlock organization={organization} onUserUpdate={handleUserUpdate} />
      {organization.subscription && (
        <SubscriptionBlock subscription={organization.subscription} onUpdate={handleSubscriptionUpdate} />
      )}
    </Box>
  )
}

export default OrganizationDetailPage
