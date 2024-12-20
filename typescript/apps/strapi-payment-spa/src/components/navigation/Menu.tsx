import React from 'react'
import { Link } from '@tanstack/react-router'
import { Box, Button, ButtonGroup } from '@dbbs/mui-components'

const Menu: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" marginTop="1rem">
    <ButtonGroup variant="contained">
      <Button component={Link} to="/profile">
        Profile
      </Button>
      <Button component={Link} to="/subscriptions">
        Subscriptions
      </Button>
      <Button component={Link} to="/purchases">
        Purchases
      </Button>
      <Button component={Link} to="/organizations">
        Organization
      </Button>
    </ButtonGroup>
  </Box>
)

export default Menu
