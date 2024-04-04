import { type HelperOptions } from 'handlebars'
import { type PlopTypes } from '@turbo/gen'

type ComparisonOperator = '===' | '!==' | '<' | '<=' | '>' | '>='
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConditionalHelper = (v1: any, operator: ComparisonOperator, v2: any, options: HelperOptions) => string

const ifCond: ConditionalHelper = (v1, operator, v2, options: HelperOptions) => {
  switch (operator) {
    case '===':
      return v1 === v2 ? options.fn(this) : options.inverse(this)
    case '!==':
      return v1 !== v2 ? options.fn(this) : options.inverse(this)
    case '<':
      return v1 < v2 ? options.fn(this) : options.inverse(this)
    case '<=':
      return v1 <= v2 ? options.fn(this) : options.inverse(this)
    case '>':
      return v1 > v2 ? options.fn(this) : options.inverse(this)
    case '>=':
      return v1 >= v2 ? options.fn(this) : options.inverse(this)
    default:
      return options.inverse(this)
  }
}

export default function helpers(plop: PlopTypes.NodePlopAPI) {
  plop.setHelper('ifCond', ifCond)
}
