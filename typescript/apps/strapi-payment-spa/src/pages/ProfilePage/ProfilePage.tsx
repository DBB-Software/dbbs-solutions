import React, { useState, useEffect, useCallback } from 'react'
import { Box, Typography, Button } from '@dbbs/mui-components'
import { Link } from '@tanstack/react-router'
import { useAuth } from '../../contexts/AuthContext'
import { EditProfileModal, ChangePasswordModal } from '../../components/modals'
import { getOrganizations } from '../../api/stripe-payment.api'
import { Organization } from '../../interfaces'

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth()
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[] | null>([])

  const fetchUserOrganizations = useCallback(async () => {
    try {
      const response = await getOrganizations()
      setOrganizations(response)
    } catch (error) {
      console.error('Failed to fetch organizations', error)
    }
  }, [])

  useEffect(() => {
    fetchUserOrganizations()
  }, [fetchUserOrganizations])

  const handleEditProfileOpen = () => setEditProfileOpen(true)
  const handleEditProfileClose = () => setEditProfileOpen(false)

  const handleChangePasswordOpen = () => setChangePasswordOpen(true)
  const handleChangePasswordClose = () => setChangePasswordOpen(false)

  return (
    <Box padding="2rem">
      <Typography variant="h4">Profile</Typography>
      <Box marginY="1rem">
        <Typography variant="body1">
          <strong>Name:</strong> {user?.username}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user?.email}
        </Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={handleEditProfileOpen}>
        Edit Profile
      </Button>
      <Button variant="contained" color="primary" onClick={handleChangePasswordOpen} style={{ marginLeft: '1rem' }}>
        Change Password
      </Button>
      <Button variant="contained" color="secondary" onClick={logout} style={{ marginLeft: '1rem' }}>
        Logout
      </Button>

      <EditProfileModal open={editProfileOpen} onClose={handleEditProfileClose} />
      <ChangePasswordModal open={changePasswordOpen} onClose={handleChangePasswordClose} />

      <Box marginTop="2rem">
        <Typography variant="h5">Organizations</Typography>
        <Box marginTop="1rem">
          {organizations &&
            organizations.map((org: Organization) => (
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
                    Manage
                  </Button>
                )}
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  )
}

export default ProfilePage
