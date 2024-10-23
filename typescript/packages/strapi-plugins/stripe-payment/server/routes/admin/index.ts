import organizationRoutes from './organization'
import planRoutes from './plan'
import productRoutes from './product'
import userRoutes from './user'
import subscriptionRoutes from './subscription'
import purchaseRoutes from './purchase'

export default [
  ...organizationRoutes,
  ...planRoutes,
  ...productRoutes,
  ...userRoutes,
  ...subscriptionRoutes,
  ...purchaseRoutes
]
