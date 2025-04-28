import { NodePlopAPI } from 'plop'
import serverlessServiceGenerators from './serverless-service.js'
import helpers from '../utils/hbsHelpers.js'

export default function generator(plop: NodePlopAPI): void {
  serverlessServiceGenerators(plop)
  helpers(plop)
}
