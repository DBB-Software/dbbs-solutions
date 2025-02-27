import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AnErrorOccurred } from '@strapi/helper-plugin'

import OrganizationList from './pages/OrganizationList'
import OrganizationDetail from './pages/OrganizationDetail'

const Organizations = () => (
  <Switch>
    <Route path="/settings/stripe-payment/organizations/:id">
      <OrganizationDetail />
    </Route>
    <Route path="/settings/stripe-payment/organizations">
      <OrganizationList />
    </Route>
    <Route path="">
      <AnErrorOccurred />
    </Route>
  </Switch>
)

export default Organizations
