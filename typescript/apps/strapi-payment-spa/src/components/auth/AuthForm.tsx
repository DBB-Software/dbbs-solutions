import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Box, TextField, Button, Typography } from '@dbbs/mui-components'
import { registerUser, loginUser } from '../../api/auth.api'
import { useAuth } from '../../contexts/AuthContext'

export interface AuthFormProps {
  isRegistering: boolean
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegistering }) => {
  const [state, setState] = useState({
    email: '',
    password: '',
    username: '',
    message: ''
  })
  const navigate = useNavigate()
  const { setAuthData } = useAuth()

  const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { email, password, username } = state

    try {
      let response
      if (isRegistering) {
        response = await registerUser({ email, password, username })
      } else {
        response = await loginUser({ identifier: email, password })
      }
      setAuthData(response.jwt, response.user)
      setState((prevState) => ({ ...prevState, message: 'Success' }))

      await navigate({ to: '/profile' })
    } catch (error) {
      if (error instanceof Error) {
        setState((prevState) => ({ ...prevState, message: error.message }))
      }
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="300px"
    >
      <TextField
        label="Email"
        type="email"
        name="email"
        value={state.email}
        onChange={handleChangeField}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        value={state.password}
        onChange={handleChangeField}
        fullWidth
        margin="normal"
      />
      {isRegistering && (
        <TextField
          label="Username"
          type="text"
          name="username"
          value={state.username}
          onChange={handleChangeField}
          fullWidth
          margin="normal"
        />
      )}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {isRegistering ? 'Register' : 'Login'}
      </Button>
      {state.message && (
        <Typography variant="body2" color="error" align="center" style={{ marginTop: '1rem' }}>
          {state.message}
        </Typography>
      )}
    </Box>
  )
}

export default AuthForm
