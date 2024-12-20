import { Card, CardContent, CardHeader } from '@dbbs/tailwind-components'
import Link from 'next/link'
import { getSubReddits } from '../services/reddit.service'

const Home = async () => {
  const reddits = await getSubReddits()

  return (
    <div>
      {reddits.map((reddit) => (
        <Card key={reddit.id} className="mb-4">
          <CardHeader>
            <Link href={reddit.url}>
              <h3 className="font-semibold">{reddit.title}</h3>
            </Link>
          </CardHeader>
          <CardContent className="reddit-content">
            <div dangerouslySetInnerHTML={{ __html: reddit.publicDescriptionHtml || '' }} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Home
