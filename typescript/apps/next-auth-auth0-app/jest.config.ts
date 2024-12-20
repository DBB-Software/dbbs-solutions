import { nextConfig } from '@dbbs/jest-config'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

export default createJestConfig({
  ...nextConfig
})
