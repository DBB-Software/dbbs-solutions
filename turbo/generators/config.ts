/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { PlopTypes } from '@turbo/gen'
import webSpaGenerators from './web-spa/generators'
import webSsrGenerators from './web-ssr/generators'
import serverApiGenerators from './server-api/generators'
import serverlessApiGenerators from './serverless-api/generators'
import serverlessServiceGenerators from './serverless-service/generators'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  webSpaGenerators(plop)
  webSsrGenerators(plop)
  serverlessApiGenerators(plop)
  serverApiGenerators(plop)
  serverlessServiceGenerators(plop)
}
