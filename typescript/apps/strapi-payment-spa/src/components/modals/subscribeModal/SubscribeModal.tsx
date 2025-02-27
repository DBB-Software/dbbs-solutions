import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@dbbs/mui-components'
import React, { useEffect, useState } from 'react'
import { getOrganizations, postCheckoutSession } from '../../../api/stripe-payment.api'
import { Organization } from '../../../interfaces'
import { modalStyle } from '../style'

interface SubscribeModalProps {
  open: boolean
  handleClose: () => void
  planId: number
}

const SubscribeModal = ({ open, handleClose, planId }: SubscribeModalProps) => {
  const [stateType, setStateType] = useState<boolean>(false)
  const [newOrganizationForm, setNewOrganizationForm] = useState<{
    name: string
    quantity: number
    organizationId: string
  }>({
    name: '',
    quantity: 1,
    organizationId: ''
  })
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const disabledButtonNewOrganization = !newOrganizationForm.name || newOrganizationForm.quantity < 1
  const disabledButtonExistingOrganization = !newOrganizationForm.organizationId || newOrganizationForm.quantity < 1

  useEffect(() => {
    const fetchOrganizations = async () => {
      const response = await getOrganizations()
      setOrganizations(response)
    }
    fetchOrganizations()
  }, [])

  const handleNewOrganization = () => {
    setStateType(false)
  }
  const handleExistingOrganization = () => {
    setStateType(true)
  }

  const handleChangeFieldName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.length < 100) {
      setNewOrganizationForm((prevState) => ({
        ...prevState,
        name: value
      }))
    }
  }

  const handleChangeFieldQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.length >= 1) {
      setNewOrganizationForm((prevState) => ({
        ...prevState,
        quantity: Number(value)
      }))
    }
  }

  const handleSubmitNewOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { name, quantity } = newOrganizationForm
    try {
      const { url } = await postCheckoutSession({ organizationName: name, quantity, planId })
      window.open(url, '_blank')
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmitExistingOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { quantity, organizationId: organizatiosnId } = newOrganizationForm
    try {
      const { url } = await postCheckoutSession({ organizationId: Number(organizatiosnId), quantity, planId })
      window.open(url, '_blank')
    } catch (err) {
      console.log(err)
    }
  }

  const handleChangeSelect = (event: SelectChangeEvent) => {
    const { value } = event.target

    if (value) {
      setNewOrganizationForm((prevState) => ({
        ...prevState,
        organizationId: value
      }))
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Box display={'flex'} flexDirection={'column'} gap={'20px'}>
          <Typography variant="h4">Select Type Commpany</Typography>
          <ButtonGroup>
            <Button variant="contained" disabled={!stateType} onClick={handleNewOrganization}>
              New Organization
            </Button>
            <Button variant="contained" disabled={stateType} onClick={handleExistingOrganization}>
              Existing Organization
            </Button>
          </ButtonGroup>
        </Box>
        <Box>
          {stateType ? (
            <form onSubmit={handleSubmitExistingOrganization}>
              <Box display={'flex'} marginTop={'10px'} flexDirection={'column'} gap={'10px'} justifyContent={'center'}>
                {organizations && (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Organization</InputLabel>
                    <Select
                      label="Organizations"
                      value={newOrganizationForm.organizationId}
                      onChange={handleChangeSelect}
                    >
                      {organizations &&
                        organizations.map((organization: Organization) => (
                          <MenuItem key={organization.id} value={organization.id}>
                            {organization.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
                <TextField
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={newOrganizationForm.quantity}
                  onChange={handleChangeFieldQuantity}
                  fullWidth
                  margin="normal"
                />
                <Button disabled={disabledButtonExistingOrganization} type="submit">
                  Send
                </Button>
              </Box>
            </form>
          ) : (
            <form onSubmit={handleSubmitNewOrganization}>
              <Box display={'flex'} flexDirection={'column'} gap={'10px'} justifyContent={'center'}>
                <TextField
                  label="Name Organization"
                  type="text"
                  name="name"
                  value={newOrganizationForm.name}
                  onChange={handleChangeFieldName}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={newOrganizationForm.quantity}
                  onChange={handleChangeFieldQuantity}
                  fullWidth
                  margin="normal"
                />
                <Button disabled={disabledButtonNewOrganization} type="submit">
                  Send
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Box>
    </Modal>
  )
}

export default SubscribeModal
