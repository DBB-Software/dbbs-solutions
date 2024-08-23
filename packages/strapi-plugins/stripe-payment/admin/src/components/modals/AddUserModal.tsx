import React from 'react'
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout'
import { Button } from '@strapi/design-system/Button'
import { TextInput } from '@strapi/design-system/TextInput'
import { Typography } from '@strapi/design-system/Typography'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  setUserEmail: (email: string) => void
  onSave: () => void
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, userEmail, setUserEmail, onSave }) => {
  if (!isOpen) return null

  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value)
  }

  const handleClose = () => {
    onClose()
  }

  const handleSave = () => {
    onSave()
  }

  return (
    <ModalLayout onClose={handleClose} labelledBy="Add new user">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="Add new user">
          Add new user
        </Typography>
      </ModalHeader>
      <ModalBody>
        <TextInput label="User Email" name="userEmail" value={userEmail} onChange={handleUserEmailChange} />
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

export default AddUserModal
