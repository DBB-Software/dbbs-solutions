import { prefixPluginTranslations } from '@strapi/helper-plugin'

import pluginPkg from '../../package.json'
import pluginId from './pluginId'
import Initializer from './components/Initializer'
import getTrad from './utils/getTrad'

const { name } = pluginPkg.strapi

export default {
  register(app: any) {
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name
    }

    app.registerPlugin(plugin)
  },

  bootstrap(app: any) {
    app.addSettingsLink('users-permissions', {
      intlLabel: {
        id: getTrad('plugin.name'),
        defaultMessage: 'Permissions'
      },
      id: `${pluginId}`,
      to: `/settings/${pluginId}`,
      Component: async () => {
        const component = await import('./components/PermissionsManager')
        return component
      },
      permissions: []
    })
  },

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
