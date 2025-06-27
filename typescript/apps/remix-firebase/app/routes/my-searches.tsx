import { type LoaderFunctionArgs, redirect, json } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import { getUserSession } from '../services/session.server'
import { getSavedSearches } from '../services/db.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserSession(request)
  if (!user) {
    return redirect('/login')
  }

  const searches = await getSavedSearches(user.uid)

  return json({ searches })
}

const MySearches = () => {
  const { searches } = useLoaderData<typeof loader>()
  return (
    <>
      <h2 className="text-3xl font-semibold text-gray-900 mb-3">My Searches</h2>
      {searches?.length && (
        <ul>
          {searches.map((search) => (
            <li key={search.id} className="mb-1">
              <Link
                to={search.path}
                className="capitalize rounded border w-[100%] block py-1 px-2 bg-white hover:bg-gray-100"
              >
                {search.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default MySearches
