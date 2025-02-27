import React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { Layout } from '../ui'

function RootComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <div>
      <Link to="/">404 Page</Link>
    </div>
  )
})
