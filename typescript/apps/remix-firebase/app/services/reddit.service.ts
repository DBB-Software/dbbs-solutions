import { normalizeRedditPosts, normalizeRedditsList } from '../lib/reddit'
import type { RedditPostNormalized, RedditListResponseItemNormalized, RedditListResponse } from '../types/reddit'

const REDDIT_URL = process.env.REDDIT_BASE_URL

export const getSubReddit = async (subReddit: string): Promise<RedditPostNormalized[]> => {
  if (!subReddit) {
    throw new Error('subbredit argument is required')
  }

  const res = await fetch(`${REDDIT_URL}/r/${subReddit}.json`, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((r) => r.json())

  return normalizeRedditPosts(res.data?.children || [])
}

export const getSubReddits = async (): Promise<RedditListResponseItemNormalized[]> => {
  const res = (await fetch(`${REDDIT_URL}/subreddits.json`, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((r) => r.json())) as RedditListResponse

  return normalizeRedditsList(res.data?.children || [])
}
