import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/geo/create')({
  component: () => <div>Geo Create</div>
})
