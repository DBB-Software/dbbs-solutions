import React, { useCallback, useState } from 'react'
import { Box, Typography, Button, IconButton } from '@dbbs/mui-components'
import { AddUserModal } from '../modals'
import { Organization } from '../../interfaces'
import { addUserToOrganization, removeUserFromOrganization } from '../../api/stripe-payment.api'

interface OrganizationUsersBlockProps {
  organization: Organization
  onUserUpdate: (updatedUsers: Organization['users']) => void
}

const OrganizationUsersBlock: React.FC<OrganizationUsersBlockProps> = ({ organization, onUserUpdate }) => {
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')

  const handleAddUser = async () => {
    try {
      await addUserToOrganization(organization.id, newUserEmail)
      setShowAddUserModal(false)
      setNewUserEmail('')
    } catch (error) {
      console.error('Failed to add user', error)
    }
  }

  const createHandleDeleteUser = useCallback(
    (userId: string) => async () => {
      try {
        await removeUserFromOrganization(organization.id, userId)
        const updatedUsers = organization.users?.filter((user) => user.id !== Number(userId))
        onUserUpdate(updatedUsers)
      } catch (error) {
        console.error('Failed to remove user', error)
      }
    },
    [organization.id, organization.users, onUserUpdate]
  )

  const handleOpenAddUserModal = () => setShowAddUserModal(true)
  const handleCloseAddUserModal = () => setShowAddUserModal(false)

  return (
    <Box marginBottom="2rem">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="1rem">
        <Typography variant="h5">Users</Typography>
        <Button onClick={handleOpenAddUserModal} variant="contained">
          Add New User
        </Button>
      </Box>
      <Box>
        {organization.users?.map((user) => (
          <Box
            key={user.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="1rem"
            borderBottom="1px solid #ccc"
          >
            <Box>
              <Typography variant="body1">{user.username}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user.email}
              </Typography>
            </Box>
            {user.id.toString() !== organization.owner_id && (
              <IconButton onClick={createHandleDeleteUser(user.id.toString())} color="secondary">
                🗑️
              </IconButton>
            )}
          </Box>
        ))}
      </Box>
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={handleCloseAddUserModal}
        userEmail={newUserEmail}
        setUserEmail={setNewUserEmail}
        onSave={handleAddUser}
      />
    </Box>
  )
}

export default OrganizationUsersBlock
