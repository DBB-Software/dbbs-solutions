import { initNestApp } from './nestApp.js'

async function startServer() {
  const app = await initNestApp()

  await app.listen(process.env.PORT || 3003)
}

startServer()
