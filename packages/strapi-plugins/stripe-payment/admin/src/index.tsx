import { prefixPluginTranslations, request } from '@strapi/helper-plugin'
import pluginPkg from '../../package.json'
import pluginId from './pluginId'
import Initializer from './components/Initializer'
import getTrad from './utils/getTrad'

const name = pluginPkg.strapi?.name

export default {
  register: async (app: any) => {
    const user = await request('/admin/users/me', { method: 'GET' })

    const isSuperAdmin = user.data.roles.some((role) => role.code === 'strapi-super-admin')

    if (isSuperAdmin) {
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
    }

    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name
    }

    app.registerPlugin(plugin)
  },

  bootstrap: (app: any) => {},

  async registerTrads(app: any) {
    const { locales } = app

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale
            }
          })
          .catch(() => {
            return {
              data: {},
              locale
            }
          })
      })
    )

    return Promise.resolve(importedTrads)
  }
}
