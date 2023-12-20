/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { PlopTypes } from '@turbo/gen'
import reactGenerators from './react/generators'
import serverlessApiGenerators from './serverless-api/generators'
import serverApiGenerators from './server-api/generators'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  reactGenerators(plop)
  serverlessApiGenerators(plop)
  serverApiGenerators(plop)
}
