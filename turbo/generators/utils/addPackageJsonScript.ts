import fs from 'fs'
import path from 'path'

export default function addPackageJsonScript(rootPath: string, script: { name: string; content: string }) {
  const packageContent = fs.readFileSync(path.join(rootPath, 'package.json'), { encoding: 'utf-8' }).toString()
  const parsedPackage = JSON.parse(packageContent)

  parsedPackage.scripts[script.name] = script.content

  fs.writeFileSync(path.join(rootPath, 'package.json'), JSON.stringify(parsedPackage))
}
