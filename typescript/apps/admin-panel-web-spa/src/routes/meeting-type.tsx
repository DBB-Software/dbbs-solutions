import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MeetingTypeList } from '../feature'

export const Route = createFileRoute('/meeting-type')({
  component: () => <MeetingTypeList />
})
