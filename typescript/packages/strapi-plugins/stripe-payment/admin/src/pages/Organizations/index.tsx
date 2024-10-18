import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AnErrorOccurred } from '@strapi/helper-plugin'

import OrganizationList from './pages/OrganizationList'
import OrganizationDetail from './pages/OrganizationDetail'

const Organizations = () => {
  return (
    <Switch>
      <Route path="/settings/stripe-payment/organizations/:id" component={OrganizationDetail} exact />
      <Route path="/settings/stripe-payment/organizations" component={OrganizationList} exact />
      <Route path="" component={AnErrorOccurred} />
    </Switch>
  )
}

export default Organizations
