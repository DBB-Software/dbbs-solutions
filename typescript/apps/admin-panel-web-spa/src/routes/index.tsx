import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ProductList } from '../feature'

export const Route = createFileRoute('/')({
  component: () => <ProductList />
})
