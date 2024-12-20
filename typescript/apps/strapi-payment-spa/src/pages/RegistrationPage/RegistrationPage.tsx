import React, { useState } from 'react'
import { Box, Typography, Link } from '@dbbs/mui-components'
import { AuthForm } from '../../components/auth'
import { AuthFormMode } from '../../types'
import { AuthFormModes } from '../../enums'

const RegistrationPage: React.FC = () => {
  const [formMode, setFormMode] = useState<AuthFormMode>(AuthFormModes.Register)

  const toggleForm = () => {
    if (formMode === AuthFormModes.Register) {
      setFormMode(AuthFormModes.Login)
    } else {
      setFormMode(AuthFormModes.Register)
    }
  }

  const getHeadingText = () => {
    switch (formMode) {
      case AuthFormModes.Register:
        return 'Register'
      case AuthFormModes.Login:
        return 'Login'
      default:
        return ''
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>
        {getHeadingText()}
      </Typography>
      <AuthForm isRegistering={formMode === AuthFormModes.Register} />
      <Link onClick={toggleForm} style={{ cursor: 'pointer', marginTop: '1rem' }}>
        {formMode === AuthFormModes.Register ? 'Already have an account? Login' : 'Don’t have an account? Register'}
      </Link>
    </Box>
  )
}

export default RegistrationPage
