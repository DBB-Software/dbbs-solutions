import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSubReddit } from '../services/reddit.service'
import { RedditPost } from '../components/ui/reddit-post'
import { useAppState } from '../store/app'
import { getUserSession } from '../services/session.server'
import { getSavedSearch } from '../services/db.server'
import { SavedSearch } from '../types/searches'
import { RedditPostNormalized } from '../types/reddit'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const user = await getUserSession(request)
  const reddits = await getSubReddit(params.topic!)

  const data: {
    savedSearch?: SavedSearch | null
    reddits: RedditPostNormalized[]
    topic: string
  } = {
    reddits,
    topic: params.topic!
  }

  if (user) {
    const savedSearch = await getSavedSearch(`/r/${params.topic}`, user.uid)
    data.savedSearch = savedSearch
  }
  return json(data)
}

const TopicPage = () => {
  const { topic, reddits, savedSearch } = useLoaderData<typeof loader>()
  const [{ user }] = useAppState()
  const [isSearchSaved, setIsSearchSaved] = useState(!!savedSearch)

  useEffect(() => {
    setIsSearchSaved(!!savedSearch)
  }, [savedSearch])

  const onSaveSearch = () => {
    fetch('/api/saved-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: topic,
        path: `/r/${topic}`
      })
    }).then(() => setIsSearchSaved(true))
  }

  const onDeleteSavedSearch = () => {
    fetch(`/api/saved-search?searchId=${savedSearch?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => setIsSearchSaved(false))
  }

  return (
    <div>
      <div className="flex items-center mb-3">
        <h1 className="text-3xl font-semibold text-gray-900 capitalize">{topic}</h1>
        {user && (
          <Star
            className="ml-2 cursor-pointer"
            fill={isSearchSaved ? '#000' : '#fff'}
            onClick={isSearchSaved ? onDeleteSavedSearch : onSaveSearch}
          />
        )}
      </div>
      {reddits?.map((post) => <RedditPost key={`post-${post.id}`} post={post} />)}
    </div>
  )
}

export default TopicPage
