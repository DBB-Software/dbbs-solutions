import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AnErrorOccurred } from '@strapi/helper-plugin'

import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'

const Products = () => (
  <Switch>
    <Route path="/settings/stripe-payment/products/:id">
      <ProductDetail />
    </Route>
    <Route path="/settings/stripe-payment/products">
      <ProductList />
    </Route>
    <Route path="">
      <AnErrorOccurred />
    </Route>
  </Switch>
)

export default Products
