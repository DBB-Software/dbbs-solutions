import { initNestApp } from './nestApp.js'
// import Registrator from './infra/registrator.js'

async function startServer() {
  const app = await initNestApp()

  await app.listen(process.env.PORT || 3003)
}

startServer()
