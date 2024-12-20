import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Modal, Box, Typography, Button, TextField } from '@dbbs/mui-components'
import { Subscription } from '../../../interfaces'
import {
  getSubscriptionDetails,
  updateSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  resubscribeSubscription
} from '../../../api/stripe-payment.api'
import { BillingPeriod, SubscriptionStatus } from '../../../enums'
import { modalStyle } from '../style'
import { formatDate } from '../../../utils/formatDate.ts'

interface SubscriptionModalProps {
  subscription: Subscription
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedSubscription: Partial<Subscription>) => void
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ subscription, isOpen, onClose, onUpdate }) => {
  const [quantity, setQuantity] = useState(subscription.quantity || 1)
  const [status, setStatus] = useState(subscription.status)
  const [createdAt, setCreatedAt] = useState(subscription.createdAt || '')
  const [nextBillingDate, setNextBillingDate] = useState<string | null>(null)

  const statusChangeHandlers = useMemo(
    () =>
      new Map<SubscriptionStatus, () => Promise<Subscription>>([
        [SubscriptionStatus.PAUSED, () => pauseSubscription(subscription.id)],
        [
          SubscriptionStatus.ACTIVE,
          async () => {
            if (status === SubscriptionStatus.PAUSED) {
              return resumeSubscription(subscription.id)
            }
            if (status === SubscriptionStatus.CANCELLED) {
              return resubscribeSubscription(subscription.id)
            }
            return Promise.resolve(subscription)
          }
        ],
        [SubscriptionStatus.CANCELLED, () => cancelSubscription(subscription.id)]
      ]),
    [status, subscription]
  )

  useEffect(() => {
    if (!isOpen) return

    const fetchSubscriptionDetails = async () => {
      try {
        const details = await getSubscriptionDetails(subscription.id)
        setStatus(details.status)
        setQuantity(details.quantity)
        setCreatedAt(details.createdAt)

        const nextDate = new Date(details.createdAt)

        switch (details.plan.interval) {
          case BillingPeriod.MONTH:
            nextDate.setMonth(nextDate.getMonth() + 1)
            break
          case BillingPeriod.YEAR:
            nextDate.setFullYear(nextDate.getFullYear() + 1)
            break
          default:
            break
        }

        setNextBillingDate(nextDate.toISOString().split('T')[0])
      } catch (error) {
        console.error('Failed to fetch subscription details', error)
      }
    }

    fetchSubscriptionDetails()
  }, [isOpen, subscription.id])

  const handleSaveSubscription = async () => {
    try {
      const updatedFields: Partial<Subscription> = {}

      if (quantity !== subscription.quantity) {
        const updatedSubscription = await updateSubscription(subscription.id, { quantity })
        updatedFields.quantity = updatedSubscription.quantity
      }

      if (status !== subscription.status) {
        updatedFields.status = status
      }

      if (updatedFields) {
        updatedFields.updatedAt = new Date().toISOString()
        onUpdate({ ...subscription, ...updatedFields })
        onClose()
      }
    } catch (error) {
      onClose()
      console.error('Failed to save subscription', error)
    }
  }

  const handleStatusChange = useCallback(
    async (newStatus: SubscriptionStatus) => {
      try {
        setStatus(newStatus)

        const updatedFields: Partial<Subscription> = {}

        const handler = statusChangeHandlers.get(newStatus)
        if (handler) {
          await handler()
          updatedFields.status = newStatus
          updatedFields.updatedAt = new Date().toISOString()
          onUpdate({ ...subscription, ...updatedFields })
          onClose()
        } else {
          console.error(`No handler found for status: ${newStatus}`)
        }
      } catch (error) {
        console.error(`Failed to change subscription status to ${newStatus}`, error)
      }
    },
    [onClose, onUpdate, statusChangeHandlers, subscription]
  )

  const createStatusChangeHandler = useCallback(
    (newStatus: SubscriptionStatus) => () => handleStatusChange(newStatus),
    [handleStatusChange]
  )

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value))
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box padding="2rem" width="500px" bgcolor="white" sx={modalStyle}>
        <Typography variant="h6">Manage Subscription</Typography>
        <Box display="flex" flexDirection="column" gap="1rem" marginTop="1rem">
          <Typography variant="body1">
            <strong>Created At:</strong> {formatDate(createdAt)}
          </Typography>
          {nextBillingDate && (
            <Typography variant="body1">
              <strong>Next Billing Date:</strong> {formatDate(nextBillingDate)}
            </Typography>
          )}
          <TextField
            label="Subscription Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Box display="flex" justifyContent="space-between" marginTop="1rem">
            {status === SubscriptionStatus.ACTIVE && (
              <Button
                variant="contained"
                color="secondary"
                onClick={createStatusChangeHandler(SubscriptionStatus.PAUSED)}
              >
                Pause Subscription
              </Button>
            )}
            {status === SubscriptionStatus.PAUSED && (
              <Button
                variant="contained"
                color="primary"
                onClick={createStatusChangeHandler(SubscriptionStatus.ACTIVE)}
              >
                Resume Subscription
              </Button>
            )}
            {status !== SubscriptionStatus.CANCELLED && (
              <Button
                variant="contained"
                color="error"
                onClick={createStatusChangeHandler(SubscriptionStatus.CANCELLED)}
              >
                Cancel Subscription
              </Button>
            )}
            {status === SubscriptionStatus.CANCELLED && (
              <Button
                variant="contained"
                color="primary"
                onClick={createStatusChangeHandler(SubscriptionStatus.ACTIVE)}
              >
                Resubscribe
              </Button>
            )}
          </Box>
          <Button variant="contained" color="primary" onClick={handleSaveSubscription} style={{ marginTop: '1rem' }}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default SubscriptionModal
