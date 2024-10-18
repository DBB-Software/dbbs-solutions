import { OrganizationDbRecord } from '../../types/index.js'
import { OrganizationEntity } from '../../entites/index.js'

export const dbOrganizationsList = (baseId: number): OrganizationDbRecord[] =>
  Array.from({ length: 15 }, (_, index) => ({
    id: index + baseId + 1,
    name: `Organization ${index + baseId + 1}`,
    quantity: 10,
    stripeCustomerId: `org_${index + baseId + 1}`
  }))

export const defaultOrganization: OrganizationEntity = {
  id: 1,
  name: 'Organization 1',
  quantity: 10,
  stripeCustomerId: 'org_1'
}
