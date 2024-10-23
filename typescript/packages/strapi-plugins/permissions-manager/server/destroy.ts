import { Strapi } from '@strapi/strapi'
import fs from 'fs'
import path from 'path'

export default async ({ strapi }: { strapi: Strapi }) => {
  const configTypes = strapi.plugin('config-sync')?.types

  if (configTypes) {
    const userRoleType = configTypes['user-role']

    await userRoleType.exportAll({
      force: true
    })

    console.log('Configurations exported to config files')

    try {
      const configPath = path.resolve(strapi.config.get('plugin.config-sync.destination', 'config/sync/'))

      const files = fs.readdirSync(configPath)

      files.forEach((file) => {
        if (file.startsWith('user-role.')) {
          const filePath = path.join(configPath, file)
          const fileContent = fs.readFileSync(filePath, 'utf-8')
          try {
            const jsonContent = JSON.parse(fileContent)
            if (!jsonContent.name) {
              fs.unlinkSync(filePath)
              console.log(`Deleted empty or invalid role file: ${file}`)
            }
          } catch (error) {
            fs.unlinkSync(filePath)
            console.log(`Deleted invalid JSON file: ${file}`)
          }
        }
      })
    } catch (error) {
      console.error('Error exporting configurations:', error)
    }
  }
}
