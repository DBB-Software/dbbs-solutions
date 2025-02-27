import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { request, useNotification } from '@strapi/helper-plugin'
import { Box } from '@strapi/design-system/Box'
import { Button } from '@strapi/design-system/Button'
import { TextInput } from '@strapi/design-system/TextInput'
import { Flex } from '@strapi/design-system/Flex'
import { ArrowLeft } from '@strapi/icons'
import { Typography } from '@strapi/design-system/Typography'
import { Table, Tbody, Td, Th, Thead, Tr } from '@strapi/design-system/Table'
import { IconButton } from '@strapi/design-system/IconButton'
import Trash from '@strapi/icons/Trash'
import Plus from '@strapi/icons/Plus'

import AddPlanModal from '../../../../components/modals/AddPlanModal'
import DeleteConfirmModal from '../../../../components/modals/DeleteConfirmModal'
import { CreatePlanRequestParams, Plan, PlanType } from '../../../../types'
import { BillingPeriod } from '../../../../../../server/enums'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const [name, setName] = useState('')
  const [plans, setPlans] = useState<Plan[]>([])
  const [showAddPlanModal, setShowAddPlanModal] = useState(false)
  const [newPlanPrice, setNewPlanPrice] = useState('')
  const [newPlanInterval, setNewPlanInterval] = useState(BillingPeriod.MONTH)
  const [newPlanType, setNewPlanType] = useState(PlanType.RECURRING)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null)
  const [planError, setPlanError] = useState<string | null>(null)
  const [priceError, setPriceError] = useState<string | null>(null)
  const toggleNotification = useNotification()

  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await request(`/stripe-payment/admin/products/${id}`, { method: 'GET' })
      setName(productData.name)
      setPlans(productData.plans || [])
    }

    fetchProduct()
  }, [id])

  const handleSaveProduct = async () => {
    await request(`/stripe-payment/admin/products/${id}`, {
      method: 'PUT',
      body: { name }
    })

    toggleNotification({
      type: 'success',
      message: 'Product saved successfully'
    })
  }

  const validatePlan = () => {
    if (newPlanType === PlanType.RECURRING) {
      const isDuplicate = plans.some((plan) => plan.interval === newPlanInterval)
      if (isDuplicate) {
        setPlanError(`Plan for ${newPlanInterval} already exists.`)
        return false
      }
    }
    setPlanError(null)
    return true
  }

  const validatePrice = () => {
    if (Number.isNaN(Number(newPlanPrice)) || Number(newPlanPrice) <= 0) {
      setPriceError('Price must be a positive number.')
      return false
    }
    setPriceError(null)
    return true
  }

  const handleAddPlan = () => {
    setShowAddPlanModal(true)
  }

  const handleSavePlan = async () => {
    if (!validatePlan() || !validatePrice() || !id) {
      return
    }

    const requestBody: CreatePlanRequestParams = {
      price: newPlanPrice,
      type: newPlanType,
      productId: id
    }

    if (newPlanType === PlanType.RECURRING) {
      requestBody.interval = newPlanInterval
    }

    const newPlan = await request('/stripe-payment/admin/plans', {
      method: 'POST',
      body: requestBody
    })

    setPlans((currentPlans) => [...currentPlans, newPlan])
    setShowAddPlanModal(false)
    setNewPlanPrice('')
    setNewPlanInterval(BillingPeriod.MONTH)
    setNewPlanType(PlanType.RECURRING)
    toggleNotification({
      type: 'success',
      message: 'Plan added successfully'
    })
  }

  const handleDeletePlan = async () => {
    if (deletePlanId) {
      await request(`/stripe-payment/admin/plans/${deletePlanId}`, { method: 'DELETE' })
      setPlans(plans.filter((plan) => plan.id !== deletePlanId))
      setShowDeleteConfirm(false)
      setDeletePlanId(null)
      toggleNotification({
        type: 'success',
        message: 'Plan deleted successfully'
      })
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleCloseAddPlanModal = () => {
    setShowAddPlanModal(false)
  }

  const handleShowDeleteConfirm = (planId: string) => {
    setDeletePlanId(planId)
    setShowDeleteConfirm(true)
  }

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false)
  }

  const handleGoBack = () => {
    history.goBack()
  }

  return (
    <Box padding={8}>
      <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
        <Button onClick={handleGoBack} startIcon={<ArrowLeft />}>
          Back
        </Button>
        <Button onClick={handleSaveProduct}>Save</Button>
      </Flex>
      <Box marginBottom={4}>
        <Typography variant="beta" as="h1">
          {name}
        </Typography>
      </Box>
      <Box marginBottom={4}>
        <TextInput label="Product Name" name="productName" value={name} onChange={handleNameChange} />
      </Box>
      <Box marginBottom={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Typography variant="beta" as="h2">
            Plans
          </Typography>
          <Button onClick={handleAddPlan} startIcon={<Plus />}>
            Add New Plan
          </Button>
        </Flex>
        <Table>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Price</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Interval</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Type</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Actions</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {plans.map((plan: Plan) => (
              <Tr key={plan.id}>
                <Td>
                  <Typography textColor="neutral800">{plan.price}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{plan.interval || 'N/A'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{plan.type}</Typography>
                </Td>
                <Td>
                  <IconButton
                    onClick={() => handleShowDeleteConfirm(plan.id)}
                    label="Delete"
                    icon={<Trash />}
                    noBorder
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <AddPlanModal
        isOpen={showAddPlanModal}
        onClose={handleCloseAddPlanModal}
        planPrice={newPlanPrice}
        setPlanPrice={setNewPlanPrice}
        planInterval={newPlanInterval}
        setPlanInterval={setNewPlanInterval}
        planType={newPlanType}
        setPlanType={setNewPlanType}
        onSave={handleSavePlan}
        priceError={priceError}
        planError={planError}
      />

      <DeleteConfirmModal isOpen={showDeleteConfirm} onClose={handleCloseDeleteConfirm} onConfirm={handleDeletePlan} />
    </Box>
  )
}

export default ProductDetail
