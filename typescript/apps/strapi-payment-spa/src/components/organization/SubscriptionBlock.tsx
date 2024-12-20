import React, { useState } from 'react'
import { Box, Typography, Button } from '@dbbs/mui-components'
import { Subscription } from '../../interfaces'
import { SubscriptionModal } from '../modals'

interface SubscriptionBlockProps {
  subscription: Subscription
  onUpdate: (updatedSubscription: Partial<Subscription>) => void
}

const SubscriptionBlock: React.FC<SubscriptionBlockProps> = ({ subscription, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleUpdateSubscription = (updatedSubscription: Partial<Subscription>) => {
    onUpdate(updatedSubscription)
    handleCloseModal()
  }

  return (
    <Box marginBottom="2rem">
      <Typography variant="h5">Subscription</Typography>
      <Box display="flex" flexDirection="column" gap="1rem">
        <Typography variant="body1">
          <strong>Plan:</strong> {subscription.plan.interval}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {subscription.status}
        </Typography>
        <Typography variant="body1">
          <strong>Price:</strong> {subscription.plan.price}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Manage Subscription
        </Button>
      </Box>

      <SubscriptionModal
        subscription={subscription}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateSubscription}
      />
    </Box>
  )
}

export default SubscriptionBlock
