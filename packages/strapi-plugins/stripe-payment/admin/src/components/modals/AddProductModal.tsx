import React from 'react'
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout'
import { Button } from '@strapi/design-system/Button'
import { TextInput } from '@strapi/design-system/TextInput'
import { Typography } from '@strapi/design-system/Typography'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  setProductName: (name: string) => void
  onSave: () => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, productName, setProductName, onSave }) => {
  if (!isOpen) return null

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value)
  }

  return (
    <ModalLayout onClose={onClose} labelledBy="Add new product">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="Add new product">
          Add new product
        </Typography>
      </ModalHeader>
      <ModalBody>
        <TextInput label="Product Name" name="productName" value={productName} onChange={handleProductNameChange} />
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

export default AddProductModal
