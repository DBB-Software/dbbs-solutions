import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GeoList } from '../../feature'

export const Route = createFileRoute('/geo/')({
  component: () => <GeoList />
})
