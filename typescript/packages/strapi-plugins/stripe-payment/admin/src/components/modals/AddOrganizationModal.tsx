import React, { useEffect, useState } from 'react'
import { request } from '@strapi/helper-plugin'
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout'
import { Button } from '@strapi/design-system/Button'
import { TextInput } from '@strapi/design-system/TextInput'
import { Select, Option } from '@strapi/design-system/Select'
import { Typography } from '@strapi/design-system/Typography'

interface AddOrganizationModalProps {
  isOpen: boolean
  onClose: () => void
  organizationName: string
  setOrganizationName: (name: string) => void
  ownerId: string
  setOwnerId: (id: string) => void
  setOwnerEmail: (email: string) => void
  quantity: number
  setQuantity: (quantity: number) => void
  onSave: () => void
}

const AddOrganizationModal: React.FC<AddOrganizationModalProps> = ({
  isOpen,
  onClose,
  organizationName,
  setOrganizationName,
  ownerId,
  setOwnerId,
  setOwnerEmail,
  quantity,
  setQuantity,
  onSave
}) => {
  const [users, setUsers] = useState<{ id: string; username: string; email: string }[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await request('/stripe-payment/admin/users', {
          method: 'GET'
        })
        setUsers(response)
      } catch (error) {
        console.error('Failed to fetch users', error)
      }
    }

    fetchUsers()
  }, [])

  const handleOrganizationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationName(e.target.value)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value))
  }

  const handleOwnerChange = (value: string) => {
    const selectedUser = users.find((user) => user.id.toString() === value)
    setOwnerId(value)
    setOwnerEmail(selectedUser ? selectedUser.email : '')
  }

  const handleClose = () => {
    onClose()
  }

  const handleSave = () => {
    onSave()
  }

  if (!isOpen) return null

  return (
    <ModalLayout onClose={handleClose} labelledBy="Add new organization">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="Add new organization">
          Add new organization
        </Typography>
      </ModalHeader>
      <ModalBody>
        <TextInput
          label="Organization Name"
          name="organizationName"
          value={organizationName}
          onChange={handleOrganizationNameChange}
        />
        <TextInput label="Quantity" name="quantity" type="number" value={quantity} onChange={handleQuantityChange} />
        <Select label="Owner" name="ownerId" value={ownerId} onChange={handleOwnerChange}>
          {users.map((user) => (
            <Option key={user.id} value={user.id}>
              {user.username}
            </Option>
          ))}
        </Select>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={handleClose} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={<Button onClick={handleSave}>Save</Button>}
      />
    </ModalLayout>
  )
}

export default AddOrganizationModal
