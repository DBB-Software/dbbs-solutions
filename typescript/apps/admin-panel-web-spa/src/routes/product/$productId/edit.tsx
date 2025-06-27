import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ProductEditPage } from '../../../feature'

export const Route = createFileRoute('/product/$productId/edit')({
  component: () => <ProductEditPage />
})
