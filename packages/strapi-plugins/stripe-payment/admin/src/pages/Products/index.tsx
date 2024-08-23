import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AnErrorOccurred } from '@strapi/helper-plugin'

import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'

const Products = () => {
  return (
    <Switch>
      <Route path="/settings/stripe-payment/products/:id" component={ProductDetail} exact />
      <Route path="/settings/stripe-payment/products" component={ProductList} exact />
      <Route path="" component={AnErrorOccurred} />
    </Switch>
  )
}

export default Products
