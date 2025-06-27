import { type ActionFunction, json } from '@remix-run/node'
import { getUserSession } from '../services/session.server'
import { saveSearch, deleteSavedSearch } from '../services/db.server'

export const action: ActionFunction = async ({ request }) => {
  const user = await getUserSession(request)
  if (!user) {
    return json({ error: 'User is required' }, { status: 403 })
  }

  if (request.method.toLowerCase() === 'delete') {
    const url = new URL(request.url)
    const searchId = url.searchParams.get('searchId')

    if (!searchId) {
      return json({ error: 'searchId is required.' }, { status: 400 })
    }

    await deleteSavedSearch(searchId)

    return json({ message: 'ok' }, { status: 200 })
  }

  const body = await request.json()

  await saveSearch({
    userId: user.uid,
    path: body?.path,
    title: body?.title
  })

  return json({ message: 'ok' }, { status: 201 })
}
