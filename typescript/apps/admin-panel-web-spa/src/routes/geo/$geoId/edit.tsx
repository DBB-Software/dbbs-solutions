import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GeoEditPage } from '../../../feature'

export const Route = createFileRoute('/geo/$geoId/edit')({
  component: () => <GeoEditPage />
})
