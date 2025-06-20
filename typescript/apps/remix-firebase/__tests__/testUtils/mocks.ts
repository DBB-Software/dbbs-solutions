import { RedditPostNormalized } from '../../app/types/reddit'

export const mockedRedditPost: Pick<RedditPostNormalized, 'id' | 'title' | 'url'> = {
  id: '1',
  title: 'Hello from Remix!',
  url: '/test-reddit'
}
