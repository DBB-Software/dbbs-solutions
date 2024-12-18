import React from 'react'
import { Modal, Box, TextField, Button, Typography } from '@dbbs/mui-components'
import { modalStyle } from '../style'

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave()
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box
          component="form"
          onSubmit={handleSubmit}
          padding="2rem"
          display="flex"
          flexDirection="column"
          alignItems="center"
          bgcolor="white"
          borderRadius="8px"
          width="400px"
          sx={modalStyle}
        >
          <Typography variant="h6">Add New User</Typography>
          <TextField
            label="User Email"
            name="userEmail"
            value={userEmail}
            onChange={handleUserEmailChange}
            fullWidth
            margin="normal"
          />
          <Box display="flex" justifyContent="space-between" marginTop="1rem" width="100%">
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddUserModal
