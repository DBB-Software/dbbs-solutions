import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/geo/')({
  component: () => <div>Geo List</div>
})
