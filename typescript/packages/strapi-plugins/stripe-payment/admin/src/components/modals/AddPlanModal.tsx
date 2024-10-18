import React from 'react'
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout'
import { Button } from '@strapi/design-system/Button'
import { TextInput } from '@strapi/design-system/TextInput'
import { Select, Option } from '@strapi/design-system/Select'
import { Typography } from '@strapi/design-system/Typography'
import { PlanType } from '../../types'
import { BillingPeriod } from '../../../../server/enums'

interface AddPlanModalProps {
  isOpen: boolean
  onClose: () => void
  planPrice: string
  setPlanPrice: (price: string) => void
  planInterval: string
  setPlanInterval: (interval: BillingPeriod) => void
  planType: string
  setPlanType: (type: PlanType) => void
  onSave: () => void
  priceError: string | null
  planError: string | null
}

const AddPlanModal: React.FC<AddPlanModalProps> = ({
  isOpen,
  onClose,
  planPrice,
  setPlanPrice,
  planInterval,
  setPlanInterval,
  planType,
  setPlanType,
  onSave,
  priceError,
  planError
}) => {
  if (!isOpen) return null

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlanPrice(e.target.value)
  }

  return (
    <ModalLayout onClose={onClose} labelledBy="Add new plan">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="Add new plan">
          Add new plan
        </Typography>
      </ModalHeader>
      <ModalBody>
        <TextInput
          label="Price (in dollars)"
          name="planPrice"
          value={planPrice}
          onChange={handlePriceChange}
          error={priceError}
        />
        <Select label="Type" name="planType" value={planType} onChange={setPlanType}>
          <Option value="recurring">Recurring</Option>
          <Option value="one_time">One-time</Option>
        </Select>
        {planType === PlanType.RECURRING && (
          <Select
            label="Interval"
            name="planInterval"
            value={planInterval}
            onChange={setPlanInterval}
            error={planError}
          >
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
          </Select>
        )}
        {planError && (
          <Typography variant="pi" textColor="danger600">
            {planError}
          </Typography>
        )}
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={onClose} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={<Button onClick={onSave}>Save</Button>}
      />
    </ModalLayout>
  )
}

export default AddPlanModal
