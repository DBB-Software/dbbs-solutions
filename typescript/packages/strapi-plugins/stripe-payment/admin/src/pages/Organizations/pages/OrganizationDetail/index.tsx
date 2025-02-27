import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { request, useNotification } from '@strapi/helper-plugin'
import { Box } from '@strapi/design-system/Box'
import { Button } from '@strapi/design-system/Button'
import { TextInput } from '@strapi/design-system/TextInput'
import { Option, Select } from '@strapi/design-system/Select'
import { Flex } from '@strapi/design-system/Flex'
import { ArrowLeft } from '@strapi/icons'
import { Typography } from '@strapi/design-system/Typography'
import { Table, Tbody, Td, Th, Thead, Tr } from '@strapi/design-system/Table'
import { IconButton } from '@strapi/design-system/IconButton'
import Trash from '@strapi/icons/Trash'
import Check from '@strapi/icons/Check'
import Plus from '@strapi/icons/Plus'
import { ModalBody, ModalFooter, ModalHeader, ModalLayout } from '@strapi/design-system/ModalLayout'

import AddUserModal from '../../../../components/modals/AddUserModal'
import DeleteConfirmModal from '../../../../components/modals/DeleteConfirmModal'
import { Organization, Purchase, Subscription, SubscriptionStatus, User } from '../../../../types'

const OrganizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [name, setName] = useState('')
  const [organizationQuantity, setOrganizationQuantity] = useState<number>(0)
  const [ownerId, setOwnerId] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [purchases, setPurchases] = useState([])
  const [subscriptionQuantity, setSubscriptionQuantity] = useState<number>(0)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [showChangeOwnerConfirm, setShowChangeOwnerConfirm] = useState(false)
  const [showDeleteOwnerWarning, setShowDeleteOwnerWarning] = useState(false)
  const toggleNotification = useNotification()

  useEffect(() => {
    const fetchOrganization = async () => {
      const organizationData = await request(`/stripe-payment/admin/organizations/${id}`, { method: 'GET' })
      setOrganization(organizationData)
      setName(organizationData.name)
      setOrganizationQuantity(organizationData.quantity)
      setOwnerId(organizationData.owner_id)
      setUsers(organizationData.users || [])
      if (organizationData.purchases.length > 0) {
        setPurchases(organizationData.purchases)
      }
      if (organizationData.subscription) {
        const subscriptionData = await request(
          `/stripe-payment/admin/subscriptions/${organizationData.subscription.id}`,
          {
            method: 'GET'
          }
        )

        setSubscription(subscriptionData)
        setSubscriptionQuantity(subscriptionData.quantity)
      }
    }

    fetchOrganization()
  }, [id])

  const handleSaveOrganization = async () => {
    await request(`/stripe-payment/admin/organizations/${id}`, {
      method: 'PUT',
      body: { name, quantity: organizationQuantity }
    })

    toggleNotification({
      type: 'success',
      message: 'Organization saved successfully'
    })
  }

  const handleChangeOwner = async () => {
    await request(`/stripe-payment/admin/organizations/${id}/owner`, {
      method: 'PATCH',
      body: { ownerId }
    })

    toggleNotification({
      type: 'success',
      message: 'Owner changed successfully'
    })

    setShowChangeOwnerConfirm(false)
  }

  const handleAddUser = () => {
    setShowAddUserModal(true)
  }

  const handleSaveUser = async () => {
    const newUser = await request(`/stripe-payment/admin/organizations/${id}/users`, {
      method: 'PATCH',
      body: { recipientEmail: newUserEmail }
    })

    setUsers([...users, newUser])
    setShowAddUserModal(false)
    setNewUserEmail('')
    toggleNotification({
      type: 'success',
      message: 'User added successfully'
    })
  }

  const handleDeleteIconClick = (userId: string) => {
    if (userId === ownerId) {
      setShowDeleteOwnerWarning(true)
    } else {
      setDeleteUserId(userId)
      setShowDeleteConfirm(true)
    }
  }

  const handleDeleteUser = async () => {
    if (deleteUserId) {
      await request(`/stripe-payment/admin/organizations/${id}/remove-user`, {
        method: 'PATCH',
        body: { userId: deleteUserId }
      })
      setUsers(users.filter((user) => user.id !== deleteUserId))
      setShowDeleteConfirm(false)
      setDeleteUserId(null)
      toggleNotification({
        type: 'success',
        message: 'User deleted successfully'
      })
    }
  }

  const handleCancelSubscription = async () => {
    if (subscription) {
      await request(`/stripe-payment/admin/subscriptions/${subscription.id}/cancel`, { method: 'PATCH' })
      setSubscription((prev) => ({ ...prev, status: SubscriptionStatus.CANCELLED }) as Subscription)
      toggleNotification({
        type: 'success',
        message: 'Subscription canceled successfully'
      })
    }
  }

  const handlePauseSubscription = async () => {
    if (subscription) {
      await request(`/stripe-payment/admin/subscriptions/${subscription.id}/pause`, { method: 'PATCH' })
      setSubscription((prev) => ({ ...prev, status: SubscriptionStatus.PAUSED }) as Subscription)
      toggleNotification({
        type: 'success',
        message: 'Subscription paused successfully'
      })
    }
  }

  const handleResumeSubscription = async () => {
    if (subscription) {
      await request(`/stripe-payment/admin/subscriptions/${subscription.id}/resume`, { method: 'PATCH' })
      setSubscription((prev) => ({ ...prev, status: SubscriptionStatus.ACTIVE }) as Subscription)
      toggleNotification({
        type: 'success',
        message: 'Subscription resumed successfully'
      })
    }
  }

  const handleSaveSubscription = async () => {
    if (subscription) {
      await request(`/stripe-payment/admin/subscriptions/${subscription.id}`, {
        method: 'PATCH',
        body: { quantity: subscriptionQuantity, planId: subscription.plan.id }
      })
      toggleNotification({
        type: 'success',
        message: 'Subscription updated successfully'
      })
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleOrganizationQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationQuantity(Number(e.target.value))
  }

  const handleSubscriptionQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscriptionQuantity(Number(e.target.value))
  }

  const handleOwnerChange = (value: number) => {
    setOwnerId(value.toString())
    if (value !== Number(organization?.owner_id)) {
      setShowChangeOwnerConfirm(true)
    }
  }

  const handleGoBack = () => {
    history.goBack()
  }

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false)
  }

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false)
  }

  const handleCloseChangeOwnerConfirm = () => {
    setShowChangeOwnerConfirm(false)
  }

  const handleCloseDeleteOwnerWarning = () => {
    setShowDeleteOwnerWarning(false)
  }

  const isOwner = (user: User) => Number(user.id) === Number(organization?.owner_id)

  // TODO: #836 split components
  return (
    <Box padding={8}>
      <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
        <Button onClick={handleGoBack} startIcon={<ArrowLeft />}>
          Back
        </Button>
        <Button onClick={handleSaveOrganization}>Save</Button>
      </Flex>
      <Box marginBottom={4}>
        <Typography variant="beta" as="h1">
          {name}
        </Typography>
      </Box>
      <Box marginBottom={4}>
        <TextInput label="Organization Name" name="organizationName" value={name} onChange={handleNameChange} />
        <TextInput
          label="Quantity"
          name="organizationQuantity"
          type="number"
          value={organizationQuantity}
          onChange={handleOrganizationQuantityChange}
        />
        <Select label="Owner" name="ownerId" value={ownerId} onChange={handleOwnerChange}>
          {users.map((user) => (
            <Option key={user.id} value={user.id}>
              {user.username}
            </Option>
          ))}
        </Select>
      </Box>
      <Box marginBottom={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Typography variant="beta" as="h2">
            Users
          </Typography>
          <Button onClick={handleAddUser} startIcon={<Plus />}>
            Add New User
          </Button>
        </Flex>
        <Table>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Username</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Email</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Actions</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <Typography textColor="neutral800">
                    {user.username}
                    {isOwner(user) && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{user.email}</Typography>
                </Td>
                <Td>
                  {!isOwner(user) && (
                    <IconButton
                      onClick={() => handleDeleteIconClick(user.id)}
                      label="Delete"
                      icon={<Trash />}
                      noBorder
                    />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {subscription && (
        <Box marginBottom={6}>
          <Typography variant="beta" as="h2" marginBottom={4}>
            Subscription
          </Typography>
          <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
            <Box>
              <Box>
                <Typography>Status: {subscription.status}</Typography>
              </Box>
              <Box>
                <Typography>
                  Price: {subscription.plan.price} per {subscription.plan.interval}
                </Typography>
              </Box>
            </Box>
            <Flex gap={2}>
              {subscription.status === SubscriptionStatus.ACTIVE && (
                <Button onClick={handlePauseSubscription}>Pause Subscription</Button>
              )}
              {subscription.status === SubscriptionStatus.PAUSED && (
                <Button onClick={handleResumeSubscription}>Resume Subscription</Button>
              )}
              {subscription.status !== SubscriptionStatus.CANCELLED && (
                <Button onClick={handleCancelSubscription}>Cancel Subscription</Button>
              )}
            </Flex>
          </Flex>
          <Box marginTop={4}>
            <TextInput
              label="Subscription Quantity"
              name="subscriptionQuantity"
              type="number"
              value={subscriptionQuantity}
              onChange={handleSubscriptionQuantityChange}
              marginBottom={4}
            />
            <Box marginTop={2}>
              <Button onClick={handleSaveSubscription}>Save Subscription</Button>
            </Box>
          </Box>
        </Box>
      )}
      <Box marginBottom={6}>
        <Typography variant="beta" as="h2" marginBottom={4}>
          Purchases
        </Typography>
        <Table>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Product</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Price</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {purchases.map((purchase: Purchase) => (
              <Tr key={purchase.id}>
                <Td>
                  <Typography textColor="neutral800">{purchase.plan.product.name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{purchase.plan.price}</Typography>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={handleCloseAddUserModal}
        userEmail={newUserEmail}
        setUserEmail={setNewUserEmail}
        onSave={handleSaveUser}
      />
      <DeleteConfirmModal isOpen={showDeleteConfirm} onClose={handleCloseDeleteConfirm} onConfirm={handleDeleteUser} />
      {showChangeOwnerConfirm && (
        <ModalLayout onClose={handleCloseChangeOwnerConfirm} labelledBy="Change owner confirmation">
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="Change owner confirmation">
              Change Owner Confirmation
            </Typography>
          </ModalHeader>
          <ModalBody>
            <Typography>Are you sure you want to change the owner of this organization?</Typography>
          </ModalBody>
          <ModalFooter
            startActions={
              <Button onClick={handleCloseChangeOwnerConfirm} variant="tertiary">
                Cancel
              </Button>
            }
            endActions={
              <Button onClick={handleChangeOwner} startIcon={<Check />} variant="danger-light">
                Confirm
              </Button>
            }
          />
        </ModalLayout>
      )}
      {showDeleteOwnerWarning && (
        <ModalLayout onClose={handleCloseDeleteOwnerWarning} labelledBy="Delete owner warning">
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="Delete owner warning">
              Delete Owner Warning
            </Typography>
          </ModalHeader>
          <ModalBody>
            <Typography>You cannot delete the owner. Please change the owner before deleting this user.</Typography>
          </ModalBody>
          <ModalFooter
            startActions={
              <Button onClick={handleCloseDeleteOwnerWarning} variant="tertiary">
                Cancel
              </Button>
            }
          />
        </ModalLayout>
      )}
    </Box>
  )
}

export default OrganizationDetail
