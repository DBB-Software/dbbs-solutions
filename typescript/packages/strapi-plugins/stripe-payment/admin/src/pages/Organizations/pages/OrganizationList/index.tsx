import React, { useState, useEffect } from 'react'
import { request, useNotification } from '@strapi/helper-plugin'
import { Button } from '@strapi/design-system/Button'
import { Box } from '@strapi/design-system/Box'
import { Flex } from '@strapi/design-system/Flex'
import { Table, Thead, Tbody, Tr, Th, Td } from '@strapi/design-system/Table'
import { Typography } from '@strapi/design-system/Typography'
import { IconButton } from '@strapi/design-system/IconButton'
import Trash from '@strapi/icons/Trash'
import Pencil from '@strapi/icons/Pencil'
import Plus from '@strapi/icons/Plus'
import { useHistory } from 'react-router-dom'

import AddOrganizationModal from '../../../../components/modals/AddOrganizationModal'
import DeleteConfirmModal from '../../../../components/modals/DeleteConfirmModal'
import { Organization } from '../../../../types'

const OrganizationList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newOrganizationName, setNewOrganizationName] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [quantity, setQuantity] = useState<number>(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteOrganizationId, setDeleteOrganizationId] = useState<string | null>(null)
  const history = useHistory()
  const toggleNotification = useNotification()

  useEffect(() => {
    const fetchOrganizations = async () => {
      const data = await request('/stripe-payment/admin/organizations', { method: 'GET' })
      setOrganizations(data)
    }

    fetchOrganizations()
  }, [])

  const resetOrganizationForm = () => {
    setNewOrganizationName('')
    setOwnerId('')
    setOwnerEmail('')
    setQuantity(0)
  }

  const handleAddOrganization = () => {
    setShowAddModal(true)
  }

  const handleSaveOrganization = async () => {
    const newOrganization = await request('/stripe-payment/admin/organizations', {
      method: 'POST',
      body: { name: newOrganizationName, ownerId, email: ownerEmail, quantity }
    })

    setOrganizations((prevOrganizations) => [...prevOrganizations, newOrganization])
    setShowAddModal(false)
    resetOrganizationForm()
    toggleNotification({
      type: 'success',
      message: 'Organization added successfully'
    })
  }

  const handleDeleteOrganization = async () => {
    if (deleteOrganizationId) {
      await request(`/stripe-payment/admin/organizations/${deleteOrganizationId}`, { method: 'DELETE' })
      setOrganizations(organizations.filter((organization) => organization.id !== deleteOrganizationId))
      setShowDeleteConfirm(false)
      setDeleteOrganizationId(null)
      toggleNotification({
        type: 'success',
        message: 'Organization deleted successfully'
      })
    }
  }

  const handleViewOrganization = (id: string) => {
    history.push(`/settings/stripe-payment/organizations/${id}`)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
  }

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false)
  }

  const handleDeleteIconClick = (id: string) => {
    setDeleteOrganizationId(id)
    setShowDeleteConfirm(true)
  }

  return (
    <Box padding={8}>
      <Flex justifyContent="space-between">
        <Box>
          <Typography variant="beta" as="h1">
            Organizations
          </Typography>
          <Typography variant="omega" textColor="neutral600">
            List of organizations
          </Typography>
        </Box>
        <Button onClick={handleAddOrganization} startIcon={<Plus />}>
          Add New Organization
        </Button>
      </Flex>

      <Box marginTop={8}>
        <Table>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Name</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Actions</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {organizations.map((organization: Organization) => (
              <Tr key={organization.id}>
                <Td>
                  <Typography textColor="neutral800" onClick={() => handleViewOrganization(organization.id)}>
                    {organization.name}
                  </Typography>
                </Td>
                <Td>
                  <Flex>
                    <IconButton
                      onClick={() => handleViewOrganization(organization.id)}
                      label="Edit"
                      icon={<Pencil />}
                      noBorder
                    />
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={() => handleDeleteIconClick(organization.id)}
                        label="Delete"
                        icon={<Trash />}
                        noBorder
                      />
                    </Box>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <AddOrganizationModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        organizationName={newOrganizationName}
        setOrganizationName={setNewOrganizationName}
        ownerId={ownerId}
        setOwnerId={setOwnerId}
        setOwnerEmail={setOwnerEmail}
        quantity={quantity}
        setQuantity={setQuantity}
        onSave={handleSaveOrganization}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeleteOrganization}
      />
    </Box>
  )
}

export default OrganizationList
