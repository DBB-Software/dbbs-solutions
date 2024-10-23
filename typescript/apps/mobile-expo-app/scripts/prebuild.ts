import path from 'path'
import { execSync } from 'child_process'
import { ConfigContext } from 'expo/config'
import loadConfig, { type ExtendedExpoConfig } from '../app.config'

const folder = path.resolve(__dirname, '..').split('/').pop()
const scriptsFolder = path.resolve(__dirname, '..', '..', '..', '..', 'scripts')
const config = loadConfig({} as ConfigContext) as ExtendedExpoConfig

execSync(
  `cd .. && npx turbo gen expo-prebuild --args '${folder}' '${config.name}' '${config.appNameProd}' '${config.appNameDev ?? config.appNameProd}' '${config.android?.package}'`,
  {
    stdio: 'inherit'
  }
)
execSync(`cd ${scriptsFolder} && tsx ./manage-credentials --folder ${folder}`, {
  stdio: 'inherit'
})
