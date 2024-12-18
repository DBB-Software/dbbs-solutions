import React, { useState } from 'react'
import { Modal, Box, TextField, Button, Typography } from '@dbbs/mui-components'
import { changePassword } from '../../../api/auth.api.ts'
import { modalStyle } from '../style'

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onClose }) => {
  const [state, setState] = useState({ currentPassword: '', newPassword: '', confirmPassword: '', message: '' })

  const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state.newPassword !== state.confirmPassword) {
      setState((prevState) => ({ ...prevState, message: 'Passwords do not match' }))
      return
    }
    try {
      await changePassword({
        currentPassword: state.currentPassword,
        password: state.newPassword,
        passwordConfirmation: state.confirmPassword
      })
      onClose()
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
        <Typography variant="h6">Change Password</Typography>
        <TextField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={state.currentPassword}
          onChange={handleChangeField}
          fullWidth
          margin="normal"
        />
        <TextField
          label="New Password"
          name="newPassword"
          type="password"
          value={state.newPassword}
          onChange={handleChangeField}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={state.confirmPassword}
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

export default ChangePasswordModal
