/* eslint-disable @typescript-eslint/no-explicit-any */

import { prefixPluginTranslations } from '@strapi/helper-plugin'
import pluginPkg from '../../package.json'
import pluginId from './pluginId'
import Initializer from './components/Initializer'
import getTrad from './utils/getTrad'

const name = pluginPkg.strapi?.name

export default {
  register: async (app: any) => {
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: getTrad('Settings.section-label'),
          defaultMessage: 'Stripe Payment plugin'
        }
      },
      [
        {
          intlLabel: {
            id: getTrad('plugin.organizations'),
            defaultMessage: 'Organizations'
          },
          id: `${pluginId}-organizations`,
          to: '/settings/stripe-payment/organizations',
          async Component() {
            return import('./pages/Organizations')
          },
          permissions: []
        },
        {
          intlLabel: {
            id: getTrad('plugin.products'),
            defaultMessage: 'Products'
          },
          id: `${pluginId}-products`,
          to: '/settings/stripe-payment/products',
          async Component() {
            return import('./pages/Products')
          },
          permissions: []
        }
      ]
    )

    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name
    }
    app.registerPlugin(plugin)
  },

  bootstrap: () => {},

  async registerTrads(app: any) {
    const { locales } = app

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale: string) =>
        import(`./translations/${locale}.json`)
          .then(({ default: data }) => ({
            data: prefixPluginTranslations(data, pluginId),
            locale
          }))
          .catch(() => ({
            data: {},
            locale
          }))
      )
    )

    return Promise.resolve(importedTrads)
  }
}
