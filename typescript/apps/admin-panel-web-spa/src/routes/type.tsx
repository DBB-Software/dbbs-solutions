import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TypeList } from '../feature'

export const Route = createFileRoute('/type')({
  component: () => <TypeList />
})
