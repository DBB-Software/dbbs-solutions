import React from 'react'
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout'
import { Button } from '@strapi/design-system/Button'
import { Typography } from '@strapi/design-system/Typography'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <ModalLayout onClose={onClose} labelledBy="Confirm delete">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="Confirm delete">
          Confirm delete
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Typography>Are you sure you want to delete this item?</Typography>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={onClose} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          <Button onClick={onConfirm} variant="danger-light">
            Delete
          </Button>
        }
      />
    </ModalLayout>
  )
}

export default DeleteConfirmModal
