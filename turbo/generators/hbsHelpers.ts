import Handlebars, { type HelperOptions, type SafeString } from 'handlebars'
import { type PlopTypes } from '@turbo/gen'

type ComparisonOperator = '===' | '!==' | '<' | '<=' | '>' | '>=' | '||' | 'XOR' | 'AND'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConditionalHelper = (v1: any, operator: ComparisonOperator, v2: any, options: HelperOptions) => string

type StringHelper = (str1: string, str2: string, str3: string) => string

type EncodeStringHelper = (inputData: string) => SafeString

const ifCond: ConditionalHelper = (v1, operator, v2, options: HelperOptions) => {
  let data = {
    root: {}
  }
  if (options.data) {
    data = Handlebars.createFrame(options.data)
  }
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
    case '||':
      return v1 || v2 ? options.fn(this, { data: data?.root }) : options.inverse(this, { data: data?.root })
    case 'XOR':
      return v1 && !v2 ? options.fn(this, { data: data?.root }) : options.inverse(this, { data: data?.root })
    case 'AND':
      return v1 && v2 ? options.fn(this, { data: data?.root }) : options.inverse(this, { data: data?.root })
    default:
      return options.inverse(this)
  }
}

const concat: StringHelper = (str1, str2, str3) => {
  return `${str1 || ''}${str2 || ''}${str3 || ''}`
}

const encodeMyString: EncodeStringHelper = (inputData) => {
  return new Handlebars.SafeString(inputData)
}

export default function helpers(plop: PlopTypes.NodePlopAPI) {
  plop.setHelper('ifCond', ifCond)
  plop.setHelper('concat', concat)
  plop.setHelper('encodeMyString', encodeMyString)
}
