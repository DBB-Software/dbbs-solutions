import React, { useState, useMemo, useCallback } from 'react'
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@dbbs/mui-components'
import { useNavigate } from '@tanstack/react-router'
import { Organization } from '../../interfaces'
import { updateOrganization, updateOrganizationOwner } from '../../api/stripe-payment.api'

interface OrganizationInfoBlockProps {
  organization: Organization
  onUpdate: (updatedOrganization: Organization) => void
}

const OrganizationInfoBlock: React.FC<OrganizationInfoBlockProps> = ({ organization, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(organization.name || '')
  const [quantity, setQuantity] = useState(organization.quantity !== null ? organization.quantity : 0)
  const [ownerId, setOwnerId] = useState(organization.owner_id || '')
  const navigate = useNavigate()

  const handleEditClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleSave = async () => {
    try {
      let updatedOrganization = { ...organization }

      if (name !== organization.name || quantity !== organization.quantity) {
        const updatedFields = await updateOrganization(organization.id, { name, quantity })
        updatedOrganization = { ...updatedOrganization, ...updatedFields }
      }

      if (ownerId !== organization.owner_id) {
        await updateOrganizationOwner(organization.id, ownerId)
        updatedOrganization.owner_id = ownerId
        navigate({ to: '/profile' })
        return
      }

      onUpdate(updatedOrganization)
      setIsEditing(false)
    } catch (error) {
      setName(organization.name)
      setQuantity(organization.quantity)
      setIsEditing(false)
      console.error('Failed to update organization', error)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value))
  }

  const handleOwnerChange = (e: { target: { value: string } }) => {
    setOwnerId(e.target.value as string)
  }

  const ownerName = useMemo(
    () => organization.users?.find((user) => user.id.toString() === organization.owner_id)?.username || 'N/A',
    [organization.users, organization.owner_id]
  )

  return (
    <Box marginBottom="2rem">
      <Typography variant="h5">Organization Information</Typography>
      {isEditing ? (
        <Box display="flex" flexDirection="column" gap="1rem">
          <TextField label="Organization Name" value={name} onChange={handleNameChange} fullWidth />
          <TextField
            label="Number of People"
            type="number"
            value={quantity !== null ? quantity : ''}
            onChange={handleQuantityChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="owner-select-label">Owner</InputLabel>
            <Select labelId="owner-select-label" value={ownerId} onChange={handleOwnerChange} fullWidth>
              {organization.users &&
                organization.users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap="1rem">
          <Typography variant="body1">
            <strong>Name:</strong> {organization.name}
          </Typography>
          <Typography variant="body1">
            <strong>Number of People:</strong> {organization.quantity}
          </Typography>
          <Typography variant="body1">
            <strong>Owner:</strong> {ownerName}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default OrganizationInfoBlock
