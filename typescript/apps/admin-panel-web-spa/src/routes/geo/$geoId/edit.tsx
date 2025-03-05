import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/geo/$geoId/edit')({
  component: () => <div>Geo Edit</div>
})
