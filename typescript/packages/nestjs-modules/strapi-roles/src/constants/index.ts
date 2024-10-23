import { Condition } from '../interfaces/index.js'

export const DEFAULT_ACTION = 'access'
export const CASL_CONDITIONS: Condition[] = [{ field: 'owner', operator: 'eq', value: 'user.id' }]
