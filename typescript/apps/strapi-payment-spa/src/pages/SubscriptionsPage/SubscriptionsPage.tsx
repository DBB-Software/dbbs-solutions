import React, { useEffect, useState } from 'react'
import { Typography, Box } from '@dbbs/mui-components'
import { getProducts } from '../../api/stripe-payment.api'
import { GetProductsResponse } from '../../types'
import { PlanCard, ProductCard } from '../../components/cards'

const SubscriptionsPage: React.FC = () => {
  const [products, setProducts] = useState<GetProductsResponse[]>([])
  const [selectedProduct, setSelectedProduct] = useState<GetProductsResponse | null>(null)

  useEffect(() => {
    async function fetchPlans() {
      const response = await getProducts()
      setProducts(response)
    }
    fetchPlans()
  }, [])

  const showPlansHandler = (id: number) => {
    const subscription = products.find((sub) => sub.id === id)
    setSelectedProduct(subscription as GetProductsResponse)
  }

  return (
    <Box padding={'20px'} display={'flex'} flexDirection={'column'} gap={'40px'}>
      <Typography textAlign={'center'} variant="h1">
        Subscription
      </Typography>
      <Box display={'flex'} gap={'60px'} justifyContent={'center'} flexWrap={'wrap'}>
        {products?.map((product) => <ProductCard buttonHandler={showPlansHandler} key={product.id} data={product} />)}
      </Box>
      <Box display={'flex'} flexDirection={'column'} gap={'20px'}>
        <Typography textAlign={'center'} variant="h3">
          Subscription duration
        </Typography>
        <Box display={'flex'} justifyContent={'center'} alignContent={'center'} gap={'20px'}>
          {selectedProduct?.plans && selectedProduct.plans.map((plan) => <PlanCard key={plan.id} data={plan} />)}
        </Box>
      </Box>
    </Box>
  )
}

export default SubscriptionsPage
