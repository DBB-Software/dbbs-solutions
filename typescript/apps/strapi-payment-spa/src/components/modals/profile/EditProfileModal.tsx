import React, { useState } from 'react'
import { Modal, Box, TextField, Button, Typography } from '@dbbs/mui-components'
import { useAuth } from '../../../contexts/AuthContext.tsx'
import { updateProfile } from '../../../api/user.api.ts'
import { modalStyle } from '../style'

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose }) => {
  const { user, setUser } = useAuth()
  const [state, setState] = useState({ username: user?.username || '', email: user?.email || '', message: '' })

  const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (user) {
        const updatedUser = await updateProfile(user.id.toString(), { username: state.username, email: state.email })
        setUser(updatedUser)
        onClose()
      }
    } catch (error) {
      if (error instanceof Error) {
        setState((prevState) => ({ ...prevState, message: error.message }))
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
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
        <Typography variant="h6">Edit Profile</Typography>
        <TextField
          label="Username"
          name="username"
          value={state.username}
          onChange={handleChangeField}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={state.email}
          onChange={handleChangeField}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Save
        </Button>
        {state.message && (
          <Typography variant="body2" color="error" align="center" style={{ marginTop: '1rem' }}>
            {state.message}
          </Typography>
        )}
      </Box>
    </Modal>
  )
}

export default EditProfileModal
