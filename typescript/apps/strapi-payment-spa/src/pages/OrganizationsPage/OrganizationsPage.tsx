import React, { useState, useEffect } from 'react'
import { Box, Typography, Button } from '@dbbs/mui-components'
import { Link } from '@tanstack/react-router'
import { getOrganizations } from '../../api/stripe-payment.api.ts'
import { Organization } from '../../interfaces'
import { useAuth } from '../../contexts/AuthContext'

const OrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[] | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchUserOrganizations = async () => {
      try {
        const response = await getOrganizations()
        setOrganizations(response)
      } catch (error) {
        console.error('Failed to fetch organizations', error)
      }
    }

    fetchUserOrganizations()
  }, [])

  return (
    <Box padding="2rem">
      <Typography variant="h4">Organizations</Typography>
      <Box marginTop="2rem">
        {organizations?.map((org) => (
          <Box key={org.id} display="flex" alignItems="center" marginBottom="1rem">
            <Typography variant="body1">{org.name}</Typography>
            {org.owner_id === user?.id.toString() && (
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: '1rem' }}
                component={Link}
                to={`/organizations/${org.id}`}
              >
                View Details
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default OrganizationsPage
