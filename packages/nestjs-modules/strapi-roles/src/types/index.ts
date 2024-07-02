import { PureAbility } from '@casl/ability'

export type AppAbility = PureAbility<[string, string]>
export type ConditionQuery = { [key: string]: { [key: string]: string | number | string[] | number[] } }
export type ConditionField = string | number | string[] | number[]
