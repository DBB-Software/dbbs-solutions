import { Strapi } from '@strapi/strapi'
import fs from 'fs'
import path from 'path'

export default async ({ strapi }: { strapi: Strapi }) => {
  const configSyncDestination = strapi.config.get('plugin.config-sync.destination', 'config/sync/')
  const configPath = path.resolve(configSyncDestination)
  const userRoleConfigType = strapi.plugin('config-sync').types['user-role']

  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true })
    console.log(`Created directory: ${configPath}`)

    await userRoleConfigType.exportAll({
      force: true
    })
    console.log('Initial configurations exported from the database to config files')
  } else {
    await userRoleConfigType.importAll({
      force: true
    })
  }

  console.log(' Permissions initialized ')
}
