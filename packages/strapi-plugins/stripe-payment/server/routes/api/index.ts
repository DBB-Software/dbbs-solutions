import organizationRoutes from './organization'
import planRoutes from './plan'
import subscriptionRoutes from './subscription'
import productRoutes from './product'
import webhook from './webhook'
import transaction from './transaction'

export default [
  ...organizationRoutes,
  ...planRoutes,
  ...subscriptionRoutes,
  ...productRoutes,
  ...webhook,
  ...transaction
]
