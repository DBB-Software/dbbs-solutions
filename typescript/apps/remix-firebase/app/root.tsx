import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import { type LinksFunction, type LoaderFunction, json } from '@remix-run/node'
import stylesheet from './styles/tailwind.css?url'
import AppLayout from './app-layout'
import { getUserSession } from './services/session.server'
import { AppProvider } from './store/app'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }]

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserSession(request)

  return json({ user })
}

export default function App() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <AppProvider initialState={{ user }}>
            <AppLayout>
              <Outlet context={{ user }} />
            </AppLayout>
          </AppProvider>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
