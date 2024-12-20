import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@dbbs/mui-components'
import { getProducts } from '../../api/stripe-payment.api'
import { PurchasesCard } from '../../components/cards'
import { Plan, Products } from '../../interfaces'
import { PlanType } from '../../enums'

interface Purchases extends Products {
  plan: Plan
}

const PurchasesPage: React.FC = () => {
  const [products, setProducts] = useState<Purchases[]>([])
  useEffect(() => {
    async function fetchPlans() {
      const response = await getProducts()

      const purchases: Purchases[] = response.flatMap((product) =>
        product.plans.filter((plan) => plan.type === PlanType.Onetime).map((plan) => ({ ...product, plan }))
      )

      setProducts(purchases)
    }
    fetchPlans()
  }, [])

  return (
    <Box display={'flex'} flexDirection={'column'} padding={'20px'} gap={'40px'}>
      <Typography textAlign={'center'} variant="h1">
        Purchases
      </Typography>
      <Box display={'flex'} gap={'60px'} justifyContent={'center'} flexWrap={'wrap'}>
        {products.map((product) => (
          <PurchasesCard
            key={product.plan.id}
            orhanizatioName={product.name}
            planId={product.plan.id}
            price={product.plan.price}
          />
        ))}
      </Box>
    </Box>
  )
}

export default PurchasesPage
