import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/meeting-type')({
  component: () => <div>Meeting Type</div>
})
